var App, Calendar, Event, EventView, Events, Group, Interval, Layouter, app, _ref, _ref1, _ref2, _ref3, _ref4,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Interval = (function() {
  function Interval(values) {
    this.values = values;
  }

  Interval.prototype.contains = function(value) {
    return (this.values[0] <= value && value <= this.values[1]);
  };

  Interval.prototype.overlaps = function(interval) {
    return (this.contains(interval.values[0])) || (this.contains(interval.values[1])) || (interval.contains(this.values[0])) || (interval.contains(this.values[1]));
  };

  return Interval;

})();

Group = (function() {
  function Group(interval) {
    this.intervals = [interval];
  }

  Group.prototype.add = function(interval) {
    return this.intervals.push(interval);
  };

  Group.prototype.overlaps = function(interval) {
    var i, _i, _len, _ref;
    _ref = this.intervals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (interval.overlaps(i)) {
        return true;
      }
    }
    return false;
  };

  Group.prototype.maxColumn = function() {
    var i, maxColumn, _i, _len, _ref;
    maxColumn = 0;
    _ref = this.intervals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.column > maxColumn) {
        maxColumn = i.column;
      }
    }
    return maxColumn;
  };

  return Group;

})();

Layouter = (function() {
  function Layouter(intervals) {
    var i, _i, _len;
    this.intervals = [];
    this.groups = [];
    for (_i = 0, _len = intervals.length; _i < _len; _i++) {
      i = intervals[_i];
      this.add(i);
    }
  }

  Layouter.prototype.add = function(interval) {
    var column, group, grouped, _i, _len, _ref;
    if (this.intervals.length === 0) {
      interval.column = 1;
    } else {
      column = 1;
      while (!this.fits(interval, column)) {
        column = column + 1;
      }
      interval.column = column;
    }
    this.intervals.push(interval);
    grouped = false;
    _ref = this.groups;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      if (group.overlaps(interval)) {
        group.add(interval);
        grouped = true;
      }
    }
    if (!grouped) {
      return this.groups.push(new Group(interval));
    }
  };

  Layouter.prototype.fits = function(interval, column) {
    var i, _i, _len, _ref;
    _ref = this.intervals.filter(function(i) {
      return i.column === column;
    });
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (interval.overlaps(i)) {
        return false;
      }
    }
    return true;
  };

  return Layouter;

})();

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.initialize = function(data) {
    var calendar, column, d, events, g, i, layout, sortedData, sortedIntervals, _i, _len, _ref1, _results;
    sortedData = data.sort(function(a, b) {
      return a[0] > b[0];
    });
    sortedIntervals = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = sortedData.length; _i < _len; _i++) {
        d = sortedData[_i];
        _results.push(new Interval(d));
      }
      return _results;
    })();
    layout = new Layouter(sortedIntervals);
    events = new Events;
    calendar = new Calendar({
      collection: events
    });
    _ref1 = layout.groups;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      g = _ref1[_i];
      column = g.maxColumn();
      _results.push((function() {
        var _j, _len1, _ref2, _results1;
        _ref2 = g.intervals;
        _results1 = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          i = _ref2[_j];
          _results1.push(events.add(new Event({
            title: i.values,
            top: i.values[0],
            height: i.values[1] - i.values[0],
            width: 1 / column,
            column: i.column
          })));
        }
        return _results1;
      })());
    }
    return _results;
  };

  return App;

})(Backbone.Router);

Event = (function(_super) {
  __extends(Event, _super);

  function Event() {
    _ref1 = Event.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  return Event;

})(Backbone.Model);

EventView = (function(_super) {
  __extends(EventView, _super);

  function EventView() {
    _ref2 = EventView.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  EventView.prototype.className = 'event';

  EventView.prototype.render = function() {
    var height, left, top, width;
    this.$el.html('<span>' + (this.model.get('title')) + '</span>');
    height = this.model.get('height') * 20;
    this.$el.height(height + 'px');
    width = this.model.get('width') * this.options.parent.$el.width();
    this.$el.width(width + 'px');
    top = this.model.get('top') * 20;
    this.$el.css('top', top + 'px');
    left = (this.model.get('column') - 1) * width;
    this.$el.css('left', left);
    return this;
  };

  return EventView;

})(Backbone.View);

Events = (function(_super) {
  __extends(Events, _super);

  function Events() {
    _ref3 = Events.__super__.constructor.apply(this, arguments);
    return _ref3;
  }

  return Events;

})(Backbone.Collection);

Calendar = (function(_super) {
  __extends(Calendar, _super);

  function Calendar() {
    _ref4 = Calendar.__super__.constructor.apply(this, arguments);
    return _ref4;
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

app = new App([[10, 20], [12, 16], [2, 4], [3, 15], [0, 1], [10, 24]]);
