describe('item', function() {
  
  var i
  
  beforeEach(function() {
    i = treemap.item({
      order: 1,
      size: 10
    })
  })
  
  it('should print a human readable string representation', function() {
    var emptyRectDesc = treemap.rect().toString()
    expect(i.toString()).toEqual('item [size: 10, order: 1, bounds: ' + emptyRectDesc + ']')
  })
  
})