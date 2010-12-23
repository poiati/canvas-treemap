describe('rect', function() {
  
  var r
  
  beforeEach(function() {
    r = treemap.rect({ x: 0, y: 0, w: 10, h: 10}) 
  })
  
  it('should create a correct rectangle', function() {
    expect(r.x).toEqual(0)
    expect(r.y).toEqual(0)
    expect(r.w).toEqual(10)
    expect(r.h).toEqual(10)
  })
  
  it('should calculate aspect ratio correctly', function() {
    expect(r.aspectRatio()).toEqual(1)
    r.w = 20
    expect(r.aspectRatio()).toEqual(2)
  })
  
  it('should copy creating a new object', function() {
    var copied = r.copy()
    
    expect(copied.x).toEqual(r.x)
    expect(copied.y).toEqual(r.y)
    expect(copied.w).toEqual(r.w)
    expect(copied.h).toEqual(r.h)
    
    expect(copied).toNotBe(r)
  })
  
  it('should print a human readable string representation', function() {
    expect(r.toString()).toEqual("rect [x: 0, y: 0, w: 10, h: 10]")
  })
})