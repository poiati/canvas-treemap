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
  
})