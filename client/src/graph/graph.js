const BORDER_WIDTH = .15;
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

export default class Graph {
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.context = canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const containerHeight = this.container.clientHeight;
    const containerWidth = this.container.clientWidth;
    this.canvas.setAttribute('height', containerHeight);
    this.canvas.setAttribute('width', containerWidth);
    this.height = containerHeight;
    this.width = containerWidth;
    this.offsetX = this.height * BORDER_WIDTH;
  }

  convertCanvasToCartesian(x, y) {
    return {
      x: x,
      y: this.height - y
    };
  }

  convertCartesianToCanvas(x, y) {
    return {
      x: x,
      y: Math.abs(y - this.height)
    };
  }


  convertGraphToCanvas(x, y) {
    const percentageX = (x - this.startDate) / this.unitWidth;
    const percentageY = (y - this.minY) / this.unitHeight;
    const graphX = this.width * percentageX;
    const graphY = this.height * percentageY;
    const cartesianX = graphX * (1 - BORDER_WIDTH);
    const cartesianY = (BORDER_WIDTH * this.height) + graphY * (1 - BORDER_WIDTH);
    return this.convertCartesianToCanvas(cartesianX, cartesianY); 
  }

  clear() {
    const c = this.context;
    c.clearRect(0, 0, this.width, this.height);
  }

  clearYAxis() {
    const c = this.context;
    const x = this.width - this.width * BORDER_WIDTH;
    const y = 0;
    c.clearRect(x, y, this.height, this.width);
  }

  drawDataSets() {
    const c = this.context;
    this.dataSets.forEach(dataSet => {
      const startingPoint = this.convertGraphToCanvas(dataSet.points[0].date, dataSet.points[0].value);
      c.beginPath();
      c.moveTo(startingPoint.x, startingPoint.y);
      dataSet.points.forEach(dataPoint => {
        if (dataPoint.date < this.startDate - oneMonth || dataPoint.date > this.currentDate + oneMonth) {
          return;
        } else {
          const canvasCoordinates = this.convertGraphToCanvas(dataPoint.date, dataPoint.value);
          c.lineTo(canvasCoordinates.x, canvasCoordinates.y);
        }
      });
      c.stroke();
    });
  }

  drawRows() {
    const c = this.context;
    c.setLineDash([1, 4]);
    const rowSpacing = (this.maxY - this.minY) / (this.numRows - 1);
    c.beginPath();
    for (var row = 1; row <= this.numRows; row++) {
      const rowValue = this.minY + ((row - 1) * rowSpacing);
      const rowPosition = this.convertGraphToCanvas(this.currentDate, rowValue); 
      c.moveTo(0, rowPosition.y);
      c.lineTo(rowPosition.x, rowPosition.y);
      const textPosition = this.convertGraphToCanvas(this.currentDate + (.05 * this.unitWidth), rowValue);
      const fontSize = Math.floor(this.height * (1 - BORDER_WIDTH) / this.numRows * .6);
      c.font = `${fontSize}px sans-serif`;
      c.fillText(rowValue, textPosition.x, textPosition.y + fontSize * .3);
    }
    c.stroke();
    c.setLineDash([]);
  }

  render(data) {
    this.numRows = data.numRows;
    this.minY = data.minY;
    this.maxY = data.maxY;
    this.period = data.period;
    this.currentDate = data.currentDate;
    this.dataSets = data.dataSets;
    this.unitHeight = this.maxY - this.minY + (this.maxY - this.minY) * .1;
    this.unitWidth = this.convertPeriodToMilliseconds(this.period);
    this.startDate = this.currentDate - this.unitWidth;
    this.clear();
    this.drawDataSets();
    this.clearYAxis();
    this.drawRows();
  }

  convertPeriodToMilliseconds(period) {
    if (period.type === 'month') {
      return period.amount * oneMonth;
    } else if (period.type === 'week') {
      return period.amount * oneWeek;
    }
  }
  
  applyStyles(styles) {
    
  }
}