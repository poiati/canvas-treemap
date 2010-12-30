describe('treemap', function() {
  it('should throw error because of invalid args', function() {
    
    var items = []
    
    expect(function() {
      var graph = treemap.treemap({
        layout: 'squarified',
        width: 400,
        height: 400
      })
    }).toThrow('data argument is mandatory')
    
    expect(function() {
      var graph = treemap.treemap({
        data: items,
        width: 400,
        height: 400
      })
    }).toThrow('type argument is mandatory')
    
    expect(function() {
      var graph = treemap.treemap({
        data: items,
        layout: 'foo',
        width: 400,
        height: 400
      })
    }).toThrow('invalid type, valid types are: squarified')
  })
  
  it('should render the graph', function() {
    var items = [
      treemap.item({order: 2, size: 10}),
      treemap.item({order: 1, size: 10})
    ]
    
    var graph = treemap.treemap({
      data: items,
      layout: 'squarified',
      width: 400,
      height: 400
    })
    
    var clearCalled = false
    var called = false
    var totalRects = 0
    
    var canvasMock = {
      getContext: function(ctx) {
        called = ctx === '2d'
        return {
          clearRect: function(x, y, w, h) {
            if (x === 0 && y === 0 && w === 400 && h === 400)
              clearCalled = true
          },
          beginPath: function() {},
          rect: function() { totalRects++ },
          fill: function() {}
          fillText: function() {}
        }
      }
    }
    
    graph.drawTo(canvasMock)
    
    expect(called).toBeTruthy()
    expect(clearCalled).toBeTruthy()
    expect(totalRects).toEqual(2)
  })
})