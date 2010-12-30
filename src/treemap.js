var treemap = (function() {
  return {
    treemap: function(spec) {
      var _that  = {},
          _outer = this,
          _data,
          _layout
      
      var style = {
        rect: {
          fill: function() {
            var rand = function() { return Math.round(Math.random() * 255) }
            var r = rand(), g = rand(), b = rand()
            return 'rgb(' + r + ', ' + g + ', ' + b + ')'
          }
        },
        title: {
          fill: function()  { return 'rgb(0, 0, 0)' },
          font: function(w) { 
            var fontSize = w / 7
            return 'bold ' + (fontSize < 8 ? 10 : fontSize) + 'px sans-serif'
          },
          margin: 2
        }
      }
      
      function _init() {
        if (!spec.data) throw new Error('data argument is mandatory')
        _data   = spec.data
        _layout = _outer.layout({ type: spec.layout })
        _that.width  = spec.width
        _that.height = spec.height
      }
      
      function _prepareData() {
        _layout.apply(_data, _outer.rect({ x: 0, y: 0, w: _that.width, h: _that.height }))
      }
      
      function _eachItem(fn) {
        for (var i = 0; i < _data.length; i++) {
          fn(_data[i])
        }
      }
      
      function _drawItem(ctx, item) {
        ctx.beginPath()
        ctx.rect(item.bounds.x, item.bounds.y, item.bounds.w, item.bounds.h)
        ctx.fillStyle = style.rect.fill()
        ctx.fill()
        _drawTitle(ctx, item)
      }
      
      function _drawTitle(ctx, item) {
        ctx.textBaseline = "top"
        ctx.font = style.title.font(item.bounds.w)
        ctx.fillStyle = style.title.fill()
        ctx.fillText(item.title, 
                     item.bounds.x + style.title.margin, 
                     item.bounds.y + style.title.margin, item.bounds.w)
      }
      
      function _drawTo(canvas) {
        _prepareData()
        var ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, _that.width, _that.height)
        _eachItem(function(item) {
          _drawItem(ctx, item)
        })
      }
      
      _that.drawTo = _drawTo
      _init()

      return _that
    },
    
    rect: function(spec) {
      var _that  = {},
          _outer = this

      function _init() {
        spec = spec || {}
        _that.x = (spec.x === undefined) ? 0 : spec.x
        _that.y = (spec.y === undefined) ? 0 : spec.y
        _that.w = (spec.w === undefined) ? 1 : spec.w
        _that.h = (spec.h === undefined) ? 1 : spec.h
      }

      function _aspectRatio() {
        return Math.max(_that.w / _that.h, _that.h / _that.w)
      }
      
      function _copy() {
        return _outer.rect(_that)
      }
      
      function _toString() {
        return "rect [x: " + _that.x + ", y: " + _that.y + ", w: " + _that.w + ", h: " + _that.h + "]"
      }

      _that.aspectRatio = _aspectRatio
      _that.copy = _copy
      _that.toString = _toString
      _init()

      return _that
    },
    
    item: function(spec) {
      var _that  = {},
          _outer = this
      
      function _init() {
        _that.size   = spec.size
        _that.title  = spec.title
        _that.bounds = _outer.rect()
      }
      
      function _toString() {
        return 'item [size: ' + _that.size + ', title: ' + _that.title + ', bounds: ' + _that.bounds + ']'
      }
      
      _that.toString = _toString
      _init()
      
      return _that
    },
    
    layout: function(spec) {
      var _that  = {},
          _outer = this,
          _layout
      
      var VERTICAL   = 1,
          HORIZONTAL = 2,
          ASCENDING  = 1,
          DESCENDING = 2
      
      function _init() {
        if (!spec || !spec.type) {
          throw new Error('type argument is mandatory')
        }
        _that.type = spec.type
        if (!types[_that.type]) {
          throw new Error('invalid type, valid types are: squarified')
        }
        _layout = types[_that.type]()
      }
      
      function _totalSize(items, start, end) {
        var total = 0
        end   = (end   === undefined) ? items.length - 1 : end
        start = (start === undefined) ? 0 : start
        for (var i = start; i <= end; i++) {
          total += items[i].size
        }
        return total
      }
      
      function _sortDescending(items) {
        var sorted = items.slice(0)
        sorted.sort(function(a, b) {
          return b.size - a.size
        })
        return sorted
      }
      
      function _slice(items, start, end, bounds, orientation, order) {
        var total    = _totalSize(items, start, end),
            a        = 0,
            vertical = (orientation === VERTICAL)
        
        for (var i = start; i <= end; i++) {
          var item = items[i],
              r    = _outer.rect(),
              b    = item.size / total
                  
          if (vertical) {
            r.x = bounds.x
            r.w = bounds.w
            r.y = (order === ASCENDING) ? bounds.y + bounds.h * a : bounds.y + bounds.h * (1 - a - b)
            r.h = bounds.h * b
          } else {
            r.x = (order === ASCENDING) ? bounds.x + bounds.w * a : bounds.x + bounds.w * (1 - a - b)
            r.w = bounds.w * b;
            r.y = bounds.y;
            r.h = bounds.h;
          }
          item.bounds = r
          a += b
        }
      }
      
      function _layoutBest(items, start, end, bounds, order) {
        var orientation = bounds.w > bounds.h ? HORIZONTAL : VERTICAL
        _slice(items, start, end, bounds, orientation, (order === undefined) ? ASCENDING : order)
      }
      
      var types = {
        squarified: function() {
          var _that = {}
          
          function _apply(items, bounds, start, end) {
            start = (start === undefined) ? 0 : start
            end   = (end   === undefined) ? items.length - 1 : end
            
            if (start > end) return
            if (end - start < 2) {
              _layoutBest(items, start, end, bounds)
              return
            }
            var x     = bounds.x, y = bounds.y, w = bounds.w, h = bounds.h,
                total = _totalSize(items, start, end),
                mid   = start,
                a     = items[start].size / total,
                b     = a

            if (w < h) {
              while (mid <= end) {
                var aspect = _normAspect(h, w, a, b),
                    q      = items[mid].size / total
                if (_normAspect(h, w, a, b + q) > aspect) break
                mid++
                b += q
              }
              _layoutBest(items, start, mid, _outer.rect({ x: x, y: y, w: w, h: h * b}))
              _apply(items, _outer.rect({x: x, y: y + h * b, w: w, h: h * (1 - b)}), mid + 1, end)
            } else {
              while (mid <= end) {
                var aspect = _normAspect(w, h, a, b),
                    q      = items[mid].size / total
                if (_normAspect(w, h, a, b + q) > aspect) break
                mid++
                b += q
              }
              _layoutBest(items, start, mid, _outer.rect({ x: x, y: y, w: w * b, h: h}))
              _apply(items, _outer.rect({x: x + w * b, y: y, w: w * (1 - b), h: h}), mid + 1, end)
            }
          }

          function _aspect(big, small, a, b) {
            return (big * b) / (small * a / b)
          }

          function _normAspect(big, small, a, b) {
            var x = _aspect(big, small, a, b)
            return x < 1 ? 1 / x : x
          }

          _that.apply = function(items, bounds, start, end) {
            _apply(_sortDescending(items), bounds, start, end)
          }

          return _that
        }
      }
      _outer.layout.totalSize = _totalSize
      _outer.layout.sortDescending = _sortDescending
      _outer.layout.layoutBest = _layoutBest
      
      _init()
      _that.apply = _layout.apply
      
      return _that
    }
  }
})()