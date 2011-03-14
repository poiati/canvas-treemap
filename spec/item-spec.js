describe('item', function() {
  
  var i
  
  beforeEach(function() {
    i = treemap.item({
      size: 10,
      title: 'foo'
    })
  })
  
  it('should print a human readable string representation', function() {
    var emptyRectDesc = treemap.rect().toString()
    expect(i.toString()).toEqual('item [size: 10, title: foo, bounds: ' + emptyRectDesc + ']')
  })
  
  it('should assign a random color when color is not specified', function() {
    expect(i.color).toBeDefined()
    expect(i.color.r).toBeLessThan(256)
    expect(i.color.r).toBeGreaterThan(-1)
    expect(i.color.g).toBeLessThan(256)
    expect(i.color.g).toBeGreaterThan(-1)
    expect(i.color.b).toBeLessThan(256)
    expect(i.color.b).toBeGreaterThan(-1)
  })
  
  it('should use color when specified', function() {
    var i = treemap.item({
      size: 10,
      title: 'foo',
      color: { r: 10, g: 10, b: 10 }
    })
    
    expect(i.color).toEqual({ r: 10, g: 10, b: 10 })
  })
  
})