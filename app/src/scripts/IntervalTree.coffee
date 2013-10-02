
class Tree 
  constructor : (@intervals) ->
    @root = new Node @intervals

  search : (value) ->
    @root.search value
    
  overlap : (interval) ->
    flatten @root.search interval.values[0], @root.search interval.values[1]

  print : ->
    @root.print 0

  findAllOverlaps : ->
    for i in @intervals
      overlaps = @overlap i
      i.overlaps = overlaps

  findAllPositions : ->
    # position is num of overlaps smaller than you
    for i in @intervals
      smaller =  (o for o in i.overlaps when o.values[0] < i.values[0])
      i.smaller = smaller.length

class Node
  constructor : (intervals) ->
    if intervals.length is 1
      @intervals = intervals
    else if intervals.length > 1
      @center = median flatten (interval.values for interval in intervals)
      @intervals = intervals.filter (d) =>
        d.contains @center
      
      leftNodes = intervals.filter (d) => d.left @center
      @left = new Node leftNodes if leftNodes.length
      
      rightNodes = intervals.filter (d) => d.right @center
      @right = new Node rightNodes if rightNodes.length

  search : (value) -> 
    results = []
    for i in @intervals
      if i.contains value 
        results.push i

    if value < @center and @left
      results = results.concat @left.search value
    else if value > @center and @right

      results = results.concat @right.search value 

    results

  print : (level) ->
    console.log spaces(level) + (interval.values for interval in @intervals)
    @left.print(level+1) if @left
    @right.print(level+1) if @right 

  
class Interval 
  constructor : (@values) ->

  contains : (value) ->
    @values[0] <= value <= @values[1]

  right : (value) ->
    @values[0] > value

  left : (value) ->
    @values[1] < value

# helpers
flatten = (a) ->
  [].concat.apply([], a)

median = (values) ->
  values.sort (a, b) -> a - b
  half = Math.floor(values.length / 2)
  values[half]

spaces = (n) ->
  result = ''
  for i in [0...n]
    result = result.concat '='
  result 

prettyPrint = (intervals) ->
  for i in intervals 
    console.log i.values
