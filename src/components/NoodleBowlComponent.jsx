import React from 'react'; 

class NoodleBowlComponent extends React.Component {

  
    constructor(props) {
        
        super(props); 
        this.state = {
  
        }
    }
  
    render () {
  
        return (
            <div className='noodle-bowl-container'>
    
                <canvas id='canvas' height={this.props.height} width={this.props.width} >
                  
                </canvas>
    
            </div>
        );
    };
    
  
}

export default NoodleBowlComponent; 