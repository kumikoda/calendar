
class Interval 
  constructor : (@values) ->

  contains : (value) ->
    @values[0] <= value <= @values[1]


  overlaps : (interval) ->
    (@contains interval.values[0]) or (@contains interval.values[1]) or (interval.contains @values[0]) or (interval.contains @values[1])


class Group 
  constructor : (interval) ->
    @intervals = [interval]
  
  add : (interval) ->
    @intervals.push interval 

  overlaps : (interval) ->
    for i in @intervals
      if interval.overlaps i
        return true
    false

  maxColumn : ->
    maxColumn = 0
    for i in @intervals
      if i.column > maxColumn 
        maxColumn = i.column
    maxColumn


class Layouter
  constructor : (intervals) ->
    @intervals = []
    @groups = []

    @add i for i in intervals 

  add : (interval) ->
    # Try to add to smallest column
    if @intervals.length is 0
      interval.column = 1
    else
      column = 1
      while not @fits(interval, column)
        column = column + 1
      interval.column = column
    
    @intervals.push interval

    # Add interval to existing group
    grouped = false 
    for group in @groups 
      if group.overlaps interval
        group.add interval
        grouped = true

    # Else start a new group
    if not grouped 
      @groups.push new Group interval  
      
  # to check if a interval fits into a column number
  fits : (interval, column) ->
    for i in ( @intervals.filter (i) -> i.column is column )
      if interval.overlaps i
        return false
    true



class App extends Backbone.Router
  initialize : (data) ->

    sortedData = data.sort (a,b) -> a[0] > b[0]
    sortedIntervals = (new Interval d for d in sortedData)

    layout = new Layouter sortedIntervals
    events = new Events
    calendar = new Calendar
      collection : events


    for g in layout.groups
      column = g.maxColumn()
      for i in g.intervals 
        events.add new Event 
          title : i.values
          top : i.values[0]
          height : i.values[1] - i.values[0]
          width : 1/column
          column : i.column




class Event extends Backbone.Model
class EventView extends Backbone.View
  className : 'event'
  render: ->
    @$el.html '<span>'+( @model.get 'title' )+'</span>'
    
    # set height 
    height = @model.get('height') * 20
    @$el.height height + 'px'

    # set width
    width = @model.get('width') * @options.parent.$el.width()
    @$el.width width + 'px'

    # set top
    top = @model.get('top') * 20
    @$el.css 'top', top + 'px'

    # set left offset
    left = (@model.get('column')-1) * width
    @$el.css 'left', left 

    @

class Events extends Backbone.Collection
class Calendar extends Backbone.View
  el : '#calendar'

  initialize : ->
    @listenTo @collection, 'add', @add

  add : (event) ->
    eventView = new EventView
      model : event
      parent : @

    @$el.append eventView.render().$el

app = new App [
  [10,20]
  [12,16]
  [2,4]
  [3,15]
  [0,1]
  [10,24]
]



    

