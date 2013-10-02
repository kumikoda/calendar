data = [
  [10,20]
  [15,25]
  [18,22]
  [10,15]
  [22,25]
  [0,2]
]

data.sort (a,b)->
  a[0] > b[0]


class App extends Backbone.Router
  initialize : ->
    events = new Events 
    
    calendar = new Calendar
      collection : events

     
    intervals = (new Interval d for d in data)
    t = new Tree intervals
    t.findAllOverlaps()
    t.findAllPositions()

    for interval in intervals 
      event = new Event
        title : interval.values
        span : interval.overlaps.length
        position : interval.smaller
      events.add event  
  
  

class Calendar extends Backbone.View
  el : '#calendar'

  initialize : ->
    @listenTo @collection, 'add', @add

  add : (event) ->
    eventView = new EventView
      model : event
      parent : @

    @$el.append eventView.render().$el


class Event extends Backbone.Model

class Events extends Backbone.Collection

class EventView extends Backbone.View
  className : 'event'
  render: ->
    @$el.html '<span>'+( @model.get 'title' )+'</span>'
    
    # set width
    span = @model.get 'span'
    @$el.addClass 'event'+span
    
    # set height
    interval = @model.get 'title'
    height = (interval[1] - interval[0] ) * 20
    @$el.height height + 'px'
    
    # set top position
    top = interval[0] * 20
    @$el.css "top",top+'px'

    # set left position
    position = @model.get 'position'
    left = position * @options.parent.$el.width() / span
    console.log @$el.width()
    @$el.css 'left',left+'px'
    @

app = new App
    