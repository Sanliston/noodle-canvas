import React from 'react'; 
import Canvas from '../Canvas/Canvas';
import NoodleBowlComponent from './NoodleBowlComponent';

class NoodleApp extends React.Component {
    canvas = null; 
    constructor(props) {
        
        super(props)
        this.state = {
            canvasParameters: {
                height: 700,
                width: 700, 
            },
            noodleParameters: {
                noodleCount: 350,
                width: 10,
                minLength: 100,
                maxLength: 200,
                minRadius: 30
            },
            
  
        } 
    }
  
    componentDidMount () {
  
      if(!this.canvas){
          this.canvas = new Canvas({
              height: this.state.canvasParameters.height,
              width: this.state.canvasParameters.width,
              noodleParams: this.state.noodleParameters,
              domSelector: '#canvas',
          });
      
          this.canvas.draw(); //initial noodle bowl
      }
      
    }
  
    handleChange = (event) => {
  
  
      let noodleParameters = this.state.noodleParameters;
      noodleParameters[event.target.name] = event.target.value;
  
      this.setState({
          ...this.state,
          noodleParameters
      }); 
  
    }
  
    renderNoodles = (event)=> {
      event.preventDefault(); 
  
      if(this.canvas){
          this.canvas.reset(); 
  
          this.canvas.draw({
              height: this.state.canvasParameters.height,
              width: this.state.canvasParameters.width,
              noodleParams: this.state.noodleParameters,
              domSelector: '#canvas',
          }); 
      }
    }
  
    render() {
        return (
            <div className='main-container'>
  
                
                <NoodleBowlComponent height={this.state.canvasParameters.height} width={this.state.canvasParameters.width} />
                
                
  
                <div className='options-container'>
                  <form onSubmit={this.renderNoodles} className='options-form'>
  
                      <div className='option'>
                          <label htmlFor='count'>
                              Noodle count
                          </label>
                          <input 
                              name='noodleCount' 
                              type='number' 
                              value={this.state.noodleParameters.noodleCount} 
                              onChange={this.handleChange} /> 
                      </div>
  
                      <div className='option'>
                          <label htmlFor='width'>
                              Noodle width
                          </label>
                          <input 
                              name='width' 
                              type='number' 
                              value={this.state.noodleParameters.width} 
                              onChange={this.handleChange} 
                              />
                      </div>
                      
  
                      {/* Commented out as implementation couldn't be finished in time
                      
                      <div className='option'>
                          <label htmlFor='minLength'>
                              Noodle min length
                          </label>
                          <input name='minLength' type='number' value={this.state.noodleParameters.minLength} />
                      </div>
                      
  
                      <div className='option'>
                          <label htmlFor='maxLength'>
                              Noodle max length
                          </label>
                          <input name='maxLength' type='number' defaultValue={this.state.noodleParameters.maxLength} />
                      </div> */}
                      
  
                      <div className='option'>
                          <label htmlFor='minRadius'>
                              Noodle min bend radius (degrees)
                          </label>
                          <input 
                              name='minRadius' 
                              type='number' 
                              defaultValue={this.state.noodleParameters.minRadius} 
                              onChange={this.handleChange}
                              /> 
                      </div>
  
                      <button type='submit'>
                          Render Noodles
                      </button>                   
  
                  </form>
                </div>
            </div>
        )
    }
}

export default NoodleApp; 