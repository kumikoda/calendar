var App, Calendar, Event, EventView, Events, app, data, _ref, _ref1, _ref2, _ref3, _ref4,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

data = [[10, 20], [15, 25], [18, 22], [10, 15], [22, 25], [0, 2]];

data.sort(function(a, b) {
  return a[0] > b[0];
});

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.initialize = function() {
    var calendar, d, event, events, interval, intervals, t, _i, _len, _results;
    events = new Events;
    calendar = new Calendar({
      collection: events
    });
    intervals = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        _results.push(new Interval(d));
      }
      return _results;
    })();
    t = new Tree(intervals);
    t.findAllOverlaps();
    t.findAllPositions();
    _results = [];
    for (_i = 0, _len = intervals.length; _i < _len; _i++) {
      interval = intervals[_i];
      event = new Event({
        title: interval.values,
        span: interval.overlaps.length,
        position: interval.smaller
      });
      _results.push(events.add(event));
    }
    return _results;
  };

  return App;

})(Backbone.Router);

Calendar = (function(_super) {
  __extends(Calendar, _super);

  function Calendar() {
    _ref1 = Calendar.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Calendar.prototype.el = '#calendar';

  Calendar.prototype.initialize = function() {
    return this.listenTo(this.collection, 'add', this.add);
  };

  Calendar.prototype.add = function(event) {
    var eventView;
    eventView = new EventView({
      model: event,
      parent: this
    });
    return this.$el.append(eventView.render().$el);
  };

  return Calendar;

})(Backbone.View);

Event = (function(_super) {
  __extends(Event, _super);

  function Event() {
    _ref2 = Event.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  return Event;

})(Backbone.Model);

Events = (function(_super) {
  __extends(Events, _super);

  function Events() {
    _ref3 = Events.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  return Events;

})(Backbone.Collection);

EventView = (function(_super) {
  __extends(EventView, _super);

  function EventView() {
    _ref4 = EventView.__super__.constructor.apply(this, arguments);
    return _ref4;
  }

  EventView.prototype.className = 'event';

  EventView.prototype.render = function() {
    var height, interval, left, position, span, top;
    this.$el.html('<span>' + (this.model.get('title')) + '</span>');
    span = this.model.get('span');
    this.$el.addClass('event' + span);
    interval = this.model.get('title');
    height = (interval[1] - interval[0]) * 20;
    this.$el.height(height + 'px');
    top = interval[0] * 20;
    this.$el.css("top", top + 'px');
    position = this.model.get('position');
    left = position * this.options.parent.$el.width() / span;
    console.log(this.$el.width());
    this.$el.css('left', left + 'px');
    return this;
  };

  return EventView;

})(Backbone.View);

app = new App;
