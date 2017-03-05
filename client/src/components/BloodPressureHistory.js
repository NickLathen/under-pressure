import React from 'react';
import Graph from '../graph/graph.js';
import mocks from '../test/mock.js';
const generatePressures = mocks.generatePressures;

export default class BloodPressureHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const graphElement = document.querySelector('.graph');
    const graphContainer = document.querySelector('.graph-container');
    this.graph = new Graph(graphElement, graphContainer);
    this.graph.render({
      numRows: 7,
      minY: 60,
      maxY: 180,
      period: {
        type: 'month',
        amount: 3
      },
      currentDate: Date.now(),
      dataSets: generatePressures()
    });
  }

  render() {
    const pressureData = this.props.pressureData;
    return (
      <div className='blood-pressure-history'>
        <div className='graph-header'></div>
        <div className='graph-container'>
          <canvas className='graph'></canvas>
        </div>
      </div>
    );
  }
} 