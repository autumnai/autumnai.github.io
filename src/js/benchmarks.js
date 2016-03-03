import plotly from 'plotly.js'
import * as benchmarks from './lib/benchmarks.js'

let frameworks = [];
let data = [];
let layout = {};

fetch('https://raw.githubusercontent.com/autumnai/deep-learning-benchmarks/master/benchmark.json')
.then(function(response) {
  return response.json()
}).then(function(json) {
  layout.title = '<b>Performance Benchmarks for Deep Learning Frameworks</b><br> (lower is better)'
  layout.barmode = 'stack'

  let models = json['nvidia-titan-x'].models;

  let chartCounter = 1;
  let modelCounter = 1;
  let yDomain = [0, 1];
  let padding = 0.05;
  models.forEach(function(model) {
    let traces = benchmarks.getTrace(chartCounter, model);

    yDomain = [1 - (modelCounter / models.length) + padding, 1 - (((modelCounter - 1) / models.length) + padding)];
    layout[`xaxis${chartCounter}`] = { domain: [0, 0.60], title: `<b>${model.name}</b>`, anchor: `y${chartCounter}` }
    layout[`yaxis${chartCounter}`] = { domain: yDomain, title: 'time in ms', anchor: `x${chartCounter}` }

    yDomain = [1 - (modelCounter / models.length) + padding, 1 - (((modelCounter - 1) / models.length) + padding)];
    layout[`xaxis${chartCounter + 1}`] = { domain: [0.7, 1], anchor: `y${chartCounter + 1}` }
    layout[`yaxis${chartCounter + 1}`] = { domain: yDomain, title: 'Device mem. in MB', anchor: `x${chartCounter + 1}` }

    data.push(traces.forward, traces.backward, traces.memory)

    modelCounter += 1;
    chartCounter += 2;
  });

  // make unique labels visable
  (data[0].showlegend = true, data[1].showlegend = true, data[2].showlegend = true);

  plotly.newPlot('myDiv', data, layout);
}).catch(function(ex) {
  console.log('parsing failed', ex)
})
