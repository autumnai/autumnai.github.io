import React, { Component } from 'react';
import * as benchmarks from '../core/Benchmarks.js';

export default class extends Component {

  componentDidMount() {
    var plotly = require('plotly.js');

    let frameworks = [];
    let data = [];
    let layout = {};

    fetch('https://raw.githubusercontent.com/autumnai/deep-learning-benchmarks/master/benchmark.json')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        layout.title = '<b>Performance Benchmarks for Deep Learning Frameworks</b><br> (lower is better)'
        layout.barmode = 'stack';

        let machine_option = document.getElementById('machine');

        for (var key of Object.keys(json)) {
          var option = document.createElement("option");
          option.text = `${json[key].devices.length}x ${json[key].name} (${json[key].type})`;
          option.value = key;

          machine_option.add(option, null);
        }

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
  }

  render() {
    return (
        <div>
        <div id="top-nav" className="row column expanded">
          <a href="https://github.com/autumnai/deep-learning-benchmarks"><img style={{position: 'absolute', top: 0, right: 0, border: 0}} src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png" /></a>
          <div style={{margin: '0 auto'}} className="row">
            <div className="small-6 columns">
              <h1 className="font-weight-900 white">
                <img src="images/autumn.logo.png" alt="Autumn Logo" />Autumn
              </h1>
            </div>
            <div className="small-6 columns">
              <ul className="menu simple align-right">
                <li><a className="no-underline font-weight-600" href="/">&gt; Autumn AI Platform</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div id="home" className="row column expanded">
          <div className="row margin-center">
            <div className="small-11 medium-11 columns small-centered text-left">
              <h2 className="white font-weight-600">Deep Learning Framework Benchmarks</h2>
              <div className="border left white" />
              <h4 style={{lineHeight: '1.6'}} className="white">
                Query and Visualize Benchmarks for various Deep Learning
                Frameworks. The Benchmark data are open and community reviewed.
                Commit your Benchmarks and see them here.
                <br /><br /><br />
                <a className="no-underline" href="https://github.com/autumnai/deep-learning-benchmarks">
                  <span style={{padding: '0.66em 1em'}} className="cbutton">
                    &gt; Publish Your Benchmarks
                  </span>
                </a>
              </h4>
            </div>
          </div>
        </div>
        <div name="news" id="news" className="row column expanded">
          <div className="row" style={{margin: 'auto'}}>
            <div className="small-12 medium-4 columns">
              <p className="news-box no-margin">
                <span className="font-weight-600">1. Select the Machine</span><br />
                <select className="font-color-dark" id="machine">
                </select>
              </p>
            </div>
            <div className="small-12 medium-4 columns">
              {/*
      <p class="news-box no-margin"><span class="font-weight-600">2. Select a Model/Layer</span><br/>
        <select class="font-color-dark" id="model">
        </select>
      </p>
      */}
            </div>
            <div className="small-12 medium-4 columns">
              <p className="news-box no-margin"><span className="font-weight-600" /><br />
              </p>
            </div>
          </div>
        </div>
        <div id="myDiv" style={{width: '100%', height: 1600}}>{/* Plotly chart will be drawn inside this DIV */}</div>
      </div>
    );
  }

}
