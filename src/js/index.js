import plotly from 'plotly.js'
import * as benchmarks from './lib/benchmarks.js'

// Github latest commit loader
fetch('https://api.github.com/orgs/autumnai/events')
.then(function(response) {
  return response.json()
}).then(function(json) {
  json.forEach(function(res) {
    if (res && res["payload"] && res["payload"]["ref"] && res["payload"]["ref"].indexOf('gh-pages') == -1 && res["type"] == "PushEvent") {
      var message = res["payload"]["commits"][0]["message"];
      var author = res["payload"]["commits"][0]["author"]["name"];
      var url = res["repo"]["name"];
      var created_at = res["created_at"];
      document.getElementById("commit-date").innerHTML = ", " + moment(created_at).fromNow();
      document.getElementById("commit-message").innerHTML = message;
      document.getElementById("commit-author").innerHTML = "<a class='white' href='https://github.com/" + author + "'>" + author + "</a>";
      document.getElementById("commit-url").href = "https://github.com/" + url;
      return
    }
  })
})

// Benchmark chart loader
let frameworks = [];
let data = [];
let layout = {};

fetch('https://raw.githubusercontent.com/autumnai/deep-learning-benchmarks/master/benchmark.json')
.then(function(response) {
  return response.json()
}).then(function(json) {
  layout.title = 'Forward and Backward Performance on Alexnet<br>lower is better';
  layout.barmode = 'stack';
  layout.paper_bgcolor = 'transparent';
  layout.backgroundcolor = 'transparent';
  layout.plot_bgcolor = 'transparent';
  layout.font = { family: 'Raleway, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif' };

  let models = json['nvidia-titan-x'].models;

  let chartCounter = 1;
  let modelCounter = 1;
  let yDomain = [0, 1];
  let padding = 0.05;
  models.forEach(function(model) {
    if (model.name == 'Alexnet') {
      let traces = benchmarks.getTrace(chartCounter, model);

      yDomain = [1 - (modelCounter / models.length) + padding, 1 - (((modelCounter - 1) / models.length) + padding)];
      layout.yaxis = { title: 'time in ms', gridcolor: '#DAD295' }

      data.push(traces.forward, traces.backward)
    }
    modelCounter += 1;
    chartCounter += 2;
  });

  // make unique labels visable
  (data[0].showlegend = true, data[1].showlegend = true);

  plotly.newPlot('performant-benchmark', data, layout, {displayModeBar: false});
}).catch(function(ex) {
  console.log('parsing failed', ex)
})
