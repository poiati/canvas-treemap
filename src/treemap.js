var treemap = (function() {
  return {
    rect: function(spec) {
      var _that  = {},
          _outer = this

      function _init() {
        if (!spec) return
        _that.x = spec.x
        _that.y = spec.y
        _that.w = spec.w
        _that.h = spec.h
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
        _that.order  = spec.order
        _that.bounds = _outer.rect()
      }
      
      function _toString() {
        return 'item [size: ' + _that.size + ', order: ' + _that.order + ', bounds: ' + _that.bounds + ']'
      }
      
      _that.toString = _toString
      _init()
      
      return _that
    },
    
    layout: function(spec) {
      var _that  = {},
          _outer = this
          
      function _init() {
        if (!spec || !spec.type) {
          throw {
            
          }
        }
        _that.type = spec.type
      }
      
      _init()
      return _that
    }
  }
})()