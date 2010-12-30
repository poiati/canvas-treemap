describe('layout', function() {
  var items,
      bounds
  
  beforeEach(function() {
    items = [
      treemap.item({order: 4, size: 10}),
      treemap.item({order: 2, size: 15}),
      treemap.item({order: 5, size: 5})
    ]
    
    bounds = treemap.rect({ x: 0, y: 0, w: 400, h: 400})
  })

  it('should raise an argument error because there is no type', function() {
    expect(function() {
      treemap.layout()
    }).toThrow('type argument is mandatory')
  })
  
  it('should raise an argument error because it is a invalid type', function() {
    expect(function() {
      treemap.layout({ type: 'foo' })
    }).toThrow('invalid type, valid types are: squarified')
  })
  
  it('should calculate tatal size of the items', function() {
    var total = treemap.layout.totalSize(items, 0, items.length - 1)
    var total2 = treemap.layout.totalSize(items, 1, items.length - 1)
    var total3 = treemap.layout.totalSize(items)
    
    expect(total).toEqual(30)
    expect(total2).toEqual(20)
    expect(total3).toEqual(30)
  })
  
  it('should sort descending', function() {
    var sorted = treemap.layout.sortDescending(items)
    
    expect(sorted[0].size).toEqual(15)
    expect(sorted[1].size).toEqual(10)
    expect(sorted[2].size).toEqual(5)
  })

  describe('squarified', function() {
    it('should work with 2 items', function() {
      var l = treemap.layout({ type: 'squarified' })
      var items = [
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10})
      ]
      l.apply(items, bounds)
      
      expect(items[0].bounds.h).toEqual(200)
      expect(items[1].bounds.h).toEqual(200)
      expect(items[0].bounds.w).toEqual(400)
      expect(items[1].bounds.w).toEqual(400)
    })
    
    it('should work with 4 items', function() {
      var l = treemap.layout({ type: 'squarified' })
      var items = [
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10})
      ]
      l.apply(items, bounds)
      
      for (var i = 0; i < items.length; i++) {
        expect(items[i].bounds.h).toEqual(200)
        expect(items[i].bounds.w).toEqual(200)
      }
    })
    
    it('should work with 6 items', function() {
      var l = treemap.layout({ type: 'squarified' })
      var items = [
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10}),
        treemap.item({order: 1, size: 10})
      ]
      l.apply(items, bounds)
      
      for (var i = 0; i < items.length; i++) {
        expect(items[i].bounds.h).toEqual(200)
        expect(Math.round(items[i].bounds.w)).toEqual(133)
      }
    })
  })
})