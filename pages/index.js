require('es6-promise').polyfill();

import React, { Component } from 'react';
import Twitter from '../components/Twitter/Twitter.js';
import Gist from '../components/Gist/Gist.js';

import * as benchmarks from '../core/Benchmarks.js';

export default class extends Component {

  componentDidMount() {
    var plotly = require('plotly.js');

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

  }

  render() {
    return (
        <div>
        <div id="top-nav" className="row">
        <div className="small-6 columns">
        <h1 className="font-weight-900 white">
        <img src="images/autumn.logo.png" alt="Autumn Logo" />Autumn
        </h1>
        </div>
        <div className="small-6 columns">
        <ul className="menu simple align-right">
        <li><a className="no-underline font-weight-600" href="#community">Community</a></li>
        <li><a className="no-underline font-weight-600" href="#support">Documentation</a></li>
        <li><a className="no-underline font-weight-600" href="https://github.com/autumnai/leaf">Code</a></li>
        </ul>
        </div>
        </div>
        <div id="home" className="row column expanded">
        <div className="row margin-center">
        <div className="small-11 medium-11 columns small-centered text-left">
        <h2 className="white font-weight-600">> git clone https://github.com/autumnai/leaf.git</h2>
        <div className="border left white" />
        <h4 style={{lineHeight: '1.6'}} className="white">The
        <span className="label white font-size-inherit radius font-color-light-blue">
        Hacker's Machine Intelligence Platform
        </span>.<br />
        <span className="font-weight-200">
        The Fastest Machine Learning Framework [<a className="white" href="deep-learning-benchmarks.html">1</a>].
        And Working On Making Deep Learning 100x More Efficient
        </span>
        </h4>
        </div>
        </div>
        </div>
        <div name="news" id="news" className="row column expanded">
        <div className="row" style={{margin: 'auto'}}>
        <a id="commit-url" className="news-box-link" href>
        <div className="small-12 medium-4 columns">
        <p className="news-box no-margin">
        <span className="font-weight-600">Latest Commit to Autumn:</span><br />
        <span id="commit-author" /><span id="commit-date" /><br />
        <span id="commit-message" />
        </p>
        </div>
        </a>
        <a className="news-box-link" href="https://github.com/autumnai/leaf/blob/master/RELEASE.md">
        <div className="small-12 medium-4 columns">
        <p className="news-box no-margin"><span className="font-weight-600">Release:
        Leaf 0.2</span><br />
        Official release notes for Leaf 0.2 and high-level change log.
        </p>
        </div>
        </a>
        <a className="news-box-link" href="deep-learning-benchmarks.html">
        <div className="small-12 medium-4 columns">
        <p className="news-box no-margin"><span className="font-weight-600">Performance
        Benchmarks</span><br />
        For Leaf 0.2, Tensorflow,
    Torch, Caffe and other Deep Learning Frameworks.
      </p>
      </div>
      </a>
      </div>
      </div>
      <div name="product" id="product" className="row expanded">
      <div className="small-12 medium-11 small-centered">
      <div className="row columns margin-center text-center">
      <div className="small-12 medium-8 small-centered column">
      <h2 style={{color: 'rgb(32,88,126)'}} className="font-color-dark text-center font-weight-600">The Autumn Architecture</h2>
      <div style={{borderColor: 'rgb(32,88,126)'}} className="border center" />
      <p style={{color: 'rgb(32,88,126)'}}>
      A Machine Intelligence Platform Engineered By Software Developers Not
      Scientists. Modular, Performant, Portable, Minimal Technical Debt.
      </p>
      </div>
      </div>
      <div style={{paddingTop: '4.5em'}} className="row columns margin-center text-center">
      <div style={{paddingTop: '4.5em'}} className="small-12 medium-8 columns">
      <div style={{width: '100%', height: 500}} id="svg-architecture">
      <img style={{height: '100%'}} src="images/autumn_leaf_collenchyma_architecture.svg" alt="Autumn Leaf Collenchyma" />
      </div>
      </div>
      <div className="small-12 medium-4 columns">
      <h4 style={{color: 'rgb(32,88,126)'}} className="font-color-dark text-left">Autumn</h4>
      <p style={{fontSize: '1em', lineHeight: 'inherit', whiteSpace: 'normal', background: 'rgb(32,88,126)'}} className="label radius text-left">Autumn is a modular, portable, end-to-end Platform
      engineered for developing performant Machine Intelligence applications.
      It consits of two Frameworks, Leaf and Collenchyma.
      </p>
      <h4 style={{marginTop: '1em'}} className="font-color-light-blue text-left">Leaf</h4>
      <p style={{fontSize: '1em', lineHeight: 'inherit', whiteSpace: 'normal'}} className="label radius text-left">Leaf is an imperative, expressive,
    cross-platform Machine Intelligence Framework, that has a clear
      architecture and no external dependecies besides Collenchyma.
      Leaf is easy to maintain, easy to use and highly performant.
      </p>
      <h4 style={{marginTop: '1em'}} className="font-color-light-brown text-left">Collenchyma</h4>
      <p style={{fontSize: '1em', lineHeight: 'inherit', whiteSpace: 'normal', background: '#DAD095'}} className="label radius text-left">Collenchyma is a portable,
    platform-agnostic, high-performance computation Framework. Applications
      build with Collenchyma can be deployed and executed
      in parallel on one or many hetereogenous devices on any host machine.
      </p>
      </div>
      <div className="small-12 column">
      <div className="quote-wrapper row">
      <div className="small-2 large-1 columns testimonial">
      <div className="quote-marks">“</div>
      </div>
      <div className="small-10 large-10 columns testimonial">
      <div className="quote">
      <p className="font-color-dark">
      Leaf was influenced by the brilliant people behind
      <a className="font-color-dark" href="http://torch.ch/">Torch</a>,
    <a className="font-color-dark" href="http://caffe.berkeleyvision.org/">Caffe</a>,
    <a className="font-color-dark" href="https://tensorflow.org/">Tensorflow</a>,
    <a className="font-color-dark" href="https://rust-lang.org/">Rust</a>
      and numerous research papers. With Autumn we try to
      transcend the opposing concepts in Machine Intelligence, bringing
      research and applications closer together.
      </p>
      <br />
      </div>
      </div>
      <div className="small-12 column text-right">
      <p className="font-color-dark font-weight-600">- Autumn Founders, <a className="font-color-dark" href="https://twitter.com/mjhirn">MJ</a> and <a className="font-color-dark" href="https://twitter.com/hobofan">Max</a></p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      <div name="consulting" id="consulting" className="row expanded">
      <div className="small-12 medium-10 small-centered columns text-center">
      <div className="row">
      <div className="small-12 medium-10 small-centered columns">
      <h2 className="font-color-dark font-weight-600">Autumn Features</h2>
      <div className="border center font-color-dark" />
      <p className="font-color-dark">
      Build maintainable Machine Intelligence applications, that can be deployed
      into the cloud for production, executed for testing on your desktop and
      shipped to smartphones, IoT and embedded devices. No code changes required.
      </p>
      </div>
      </div>
      <div style={{padding: '4.5rem 0', margin: '0 auto'}} className="row">
      <div style={{paddingTop: '1rem'}} className="small-12 medium-3 columns">
      <h4 className="font-color-dark">PERFORMANT</h4>
      <div className="border font-color-dark center" />
      <p className="font-color-dark text-justify">Autumn enables developers to build
      maintainable applications, train and run the models efficiently,
    reducing development and maintainance costs and increasing productivity.<br />
      <br />
      <a href="deep-learning-benchmarks.html" className="no-underline">&gt; More Benchmarks
      </a></p><a href="deep-learning-benchmarks.html" className="no-underline">
      </a></div><a href="deep-learning-benchmarks.html" className="no-underline">
      <div id="performant-benchmark" style={{paddingTop: '1rem', height: 350}} className="small-12 medium-9 columns" />
      </a></div><a href="deep-learning-benchmarks.html" className="no-underline">
      </a><div style={{padding: '4.5rem 0', margin: '0 auto'}} className="row">
      <div style={{padding: 0, height: 300, overflowY: 'scroll'}} className="small-12 medium-9 columns">
      <Gist src="https://gist.github.com/MichaelHirn/87dd3a0e8279e44fdfb6.js" />
      </div>
      <div style={{paddingTop: '1rem'}} className="small-12 medium-3 columns">
      <h4 className="font-color-dark">PRACTICAL</h4>
      <div className="border font-color-dark center" />
      <p className="font-color-dark text-justify">Autumn enables developers to understand the
      whole stack, write maintainable plugins and safely implement the latest
      research outcomes into their applications.<br />
      <br />
      <a className="no-underline" href="https://github.com/autumnai/collenchyma">&gt; More Code</a>
      </p>
      </div>
      </div>
      <div style={{padding: '4.5rem 0', margin: '0 auto'}} className="row">
      <div style={{paddingTop: '1rem'}} className="small-12 medium-8 small-centered columns">
      <h4 className="font-color-dark">PORTABLE</h4>
      <div className="border font-color-dark center" />
      <p className="font-color-dark text-justify">Autumn gives you the choice to run, deploy
      and test your Machine Intelligence applications whereever you want. Any
      machine, any OS, any hardware. If it doesn't run on iOS, Windows, Android or on
      a chip without an operating system, it's a bug, let us know about it by creating an
      <a className="font-color-dark" href="https://github.com/autumnai/collenchyma">issue on Github</a>.<br />
      <br />
      <a className="no-underline" href="https://github.com/autumnai/collenchyma">&gt;More Collenchyma</a></p>
      </div>
      </div>
      </div>
      </div>
      <div name="use" id="use" className="row expanded">
      <div className="small-12 medium-10 small-centered columns text-center">
      <h2 className="font-color-dark font-weight-600">Autumn Examples</h2>
      <div className="border font-color-dark white" />
      <br />
      <p className="font-color-dark">
      Here are some of the ways developers and companies can use the Autumn
      Platform for building Machine Intelligence driven applications.
      </p>
      <div style={{padding: '2.5rem 0', margin: '0 auto'}} className="row small-uncollapsed">
      <div className="small-12 medium-4 columns">
      <div className="image-wrapper overlay-fade-in" style={{border: '1px solid rgb(32,89,126)', height: 400}}>
      <img style={{margin: '0 -23px'}} src="images/production.jpg" alt="Autumn in Production" />
      <div className="image-overlay-content">
      <h4 className="font-color-dark">#PRODUCTION</h4>
      <div className="border center" />
      <p className="font-color-dark">Engineer reliable, production-ready
      applications, minimize technical debt and keep your applications easily
      maintainable.</p>
      </div>
      </div>
      </div>
      <div className="small-12 medium-4 columns">
      <div className="image-wrapper overlay-fade-in" style={{border: '1px solid rgb(32,89,126)', height: 400}}>
      <img style={{margin: '0 -23px'}} src="images/big_data.jpg" alt="Autumn and Big Data" />
      <div className="image-overlay-content">
      <h4 className="font-color-dark">#BIGDATA</h4>
      <div className="border center" />
      <p className="font-color-dark">Hook Autumn into your big data environment,
    for scaled learning and fast performance on stream computation thanks
      to Rusts zero-copy.</p>
        </div>
        </div>
        </div>
        <div className="small-12 medium-4 columns">
        <div className="image-wrapper overlay-fade-in" style={{border: '1px solid rgb(32,89,126)', height: 400}}>
        <img style={{margin: '0 -23px'}} src="images/iot.jpg" alt="Autumn and IoT" />
        <div className="image-overlay-content">
        <h4 className="font-color-dark">#IOT</h4>
        <div className="border center" />
        <p>Deploy trained models to IoT and
        embedded devices for on-device, no-internet-required Machine
        Learning.<br /><br /></p>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div name="community" id="community" className="row column expanded">
        <div style={{margin: '0 auto'}} className="row">
        <div className="small-12 medium-8 small-centered columns text-center">
        <h2 className="font-weight-600">Community</h2>
        <div className="border center white" />
        <p>
        We love the ML community very much.
        Leaf und Collenchyma are free for everyone. You can even choose
        between the MIT or Apache 2.0 license - whatever strikes your fancy.
        </p>
        </div>
        </div>
        <div style={{margin: '0 auto'}} className="row">
        <div style={{padding: '4.5rem 0'}} className="small-12 medium-10 small-centered columns">
        <div className="row small-up-1 medium-up-3">
        <div className="column">
        <blockquote className="twitter-tweet" data-cards="hidden" lang="en">
        <p lang="en" dir="ltr"><a href="https://t.co/mm24ABBhIz">https://t.co/mm24ABBhIz</a> <a href="https://twitter.com/hashtag/HPC?src=hash">#HPC</a> with <a href="https://twitter.com/hashtag/OpenCL?src=hash">#OpenCL</a> in <a href="https://twitter.com/rustlang">@rustlang</a>. From the outstanding team in <a href="https://t.co/mSZVSH2ObG">https://t.co/mSZVSH2ObG</a></p>— Cristián Antuña (@AntuniaCepellot) <a href="https://twitter.com/AntuniaCepellot/status/674337903586222081">December 8, 2015</a>
        </blockquote>
        </div>
        <div className="column">
        <blockquote className="twitter-tweet" data-cards="hidden" data-lang="en">
        <p lang="en" dir="ltr">Leaf: Machine Learning for Hackers <a href="https://t.co/s992SiwtRK">https://t.co/s992SiwtRK</a></p>— Hacker News (@newsycombinator) <a href="https://twitter.com/newsycombinator/status/707204573799313408">March 8, 2016</a>
        </blockquote>
        </div>
        <div className="column">
        <blockquote className="twitter-tweet" data-cards="hidden" lang="en">
        <p lang="en" dir="ltr">About Rust's machine learning community: <a href="https://t.co/fs7mxOwaTG">https://t.co/fs7mxOwaTG</a></p>— so much writing (@steveklabnik) <a href="https://twitter.com/steveklabnik/status/684757114611478528">January 6, 2016</a>
        </blockquote>
        </div>
        </div>
        </div>
        </div>
        <div id="support" style={{margin: '0 auto', paddingTop: '6em'}} className="row text-center">
        <div className="small-12 medium-8 small-centered columns">
        <h2 className="font-weight-600">Support</h2>
        <div className="border center white" />
        <p>
        With a bit of luck you find us online on the
        <span className="label white radius font-color-light-blue">#rust-machine-learing IRC at
        irc.mozilla.org</span>, but we are always approachable on <a href="https://gitter.im/autumnai/leaf">
        <span className="label white radius font-color-light-blue">Gitter/Leaf</span></a> and <a href="https://gitter.im/autumnai/collenchyma">
        <span className="label white radius font-color-light-blue">Gitter/Collenchyma</span></a>. If you
        found a bug or have a feature request, you can create an issue on
        <a href="https://github.com/autumnai/leaf"><span className="label white radius font-color-light-blue">Github/Leaf</span></a>
        and <a href="https://github.com/autumnai/collenchyma"><span className="label white radius font-color-light-blue">Github/Collenchyma</span></a>.
        And for more private matters, send us a mail straight to our inbox <a href="mailto:developers@autumnai.com">
        <span className="label white radius font-color-light-blue">developers@autumnai.com</span></a>.
        </p>
        </div>
        </div>
        <div style={{margin: '0 auto', padding: '8em 0'}} className="row text-center">
        <div className="small-12 medium-8 small-centered columns">
        <h2 className="white font-weight-600">Resources</h2>
        <div className="border center white" />
        <p className="white text-justify">
        <a href="https://github.com/autumnai/leaf#examples"><span className="label white radius font-color-light-blue">Learn from examples</span></a>.
        Refer to <a href="http://autumnai.github.io/leaf"><span className="label white radius font-color-light-blue">Leafs'</span></a> and
        <a href="http://autumnai.github.io/collenchyma"><span className="label white radius font-color-light-blue">Collenchymas'</span></a> documentation - btw you can
        <a className="no-underline white" href="https://github.com/autumnai/leaf/issues/45#issuecomment-189409309">help us create a higher-level documentation for the community</a>. Or browse through our
        <a href="http://slideshare.net/MichaelJHirn/machine-learning-in-rust-with-leaf-and-collenchyma"><span className="label white radius font-color-light-blue">Mozilla talk slides</span></a>.
        </p>
        </div>
        </div>
        <div style={{margin: '0 auto', padding: '6em 0'}} className="row">
        <div className="small-12 medium-8 small-centered columns text-center">
        <h2 className="font-weight-600">Let's Hack AI.</h2>
        <div className="border center white" />
        <p>Machine Learning researchers
        came a long way and now we hackers build the tools to make Machine Intelligence accessable for everyone.
        <span className="label white radius font-color-light-blue">Autumn</span> provides the platform to make your contributions and extensions open and instantly
        available to other developers, researchers and companies. Click on the button
        to <span className="label white radius font-color-light-blue">start hacking on AI</span>.</p><br /><br />
        <p className="text-center white">
        <a className="no-underline" href="https://github.com/autumnai/leaf">
        <span className="white cbutton">&gt; GET STARTED!</span>
        </a>
        <span style={{marginLeft: 15}}>or <a href="mailto:developers@autumnai.com?cc=mj@autumnai.com">
        <span style={{marginLeft: 10}} className="label radius">apply for a job</span>
        </a></span>
        </p>
        </div>
        </div>
        </div>
        <div id="footer" className="row expanded">
        <div className="small-12 columns">
        <div style={{margin: '0 auto'}} className="row">
        <div className="small-12 medium-4 columns">
        <p className="font-weight-900">Updates</p>
        <ul className="menu vertical full-width">
        <li>Subscribe to our monthly newsletter</li>
        <li>
        <form action="//storeness.us11.list-manage.com/subscribe/post?u=676467fe256940259725b9989&id=7cc1e166a0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
        <div style={{margin: '0 auto'}} className="row small-collapse">
        <div className="small-8 columns">
        <input style={{height: '2.5rem', boxShadow: 'none', transition: 'none'}} type="email" defaultValue name="EMAIL" className="email" id="mce-EMAIL" placeholder="Your Email" required />
        </div>
        <div className="small-3 columns">
        <input type="submit" defaultValue="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button postfix" />
        </div>
        <div className="small-1 columns" />
        </div>
        <div style={{position: 'absolute', left: '-5000px'}}>
        <input type="text" name="b_676467fe256940259725b9989_7cc1e166a0" tabIndex={-1} defaultValue />
        </div>
        <div className="clear" />
        </form>
        </li>
        </ul>
        </div>
        <div className="small-12 medium-8 columns">
        <div className="row small-up-3">
        <div className="column">
        <p className="font-weight-900">Autumn</p>
        <ul className="menu vertical full-width">
        <li><a href="https://medium.com/@autumn_eng">Blog</a></li>
        <li><a href="mailto:press@autumnai.com">Press</a></li>
        <li><a href="mailto:hi@autumnai.com">Contact</a></li>
        </ul>
        </div>
        <div className="column">
        <p className="font-weight-900">Resources</p>
        <ul className="menu vertical full-width">
        <li><a href="http://autumnai.github.io/leaf">Documentation</a></li>
        <li><a href="https://github.com/autumnai/leaf-examples">Examples</a></li>
        <li><a href="https://gitter.im/autumnai/leaf">Community Support</a></li>
        <li><a href="mailto:support@autumnai.com">Enterprise Support</a></li>
        </ul>
        </div>
        <div className="column">
        <p className="font-weight-900">Connect</p>
        <ul className="menu vertical full-width">
        <li><a href="https://twitter.com/autumn_eng">&gt; Twitter</a></li>
        <li><a href="https://medium.com/@autumn_eng">Medium</a></li>
        <li><a href="https://github.com/autumnai">Github</a></li>
        </ul>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div className="last-line small-12 columns">
        <p className="text-center" style={{fontSize: '0.8rem', fontWeight: 100}}>
        © 2016 Autumn | DE295073789 | HBR 28677 | <a className="white no-underline" href="impressum.html">Impressum</a>
        </p>
        </div>
        </div>
        <Twitter />
        </div>
        );
  }

}
