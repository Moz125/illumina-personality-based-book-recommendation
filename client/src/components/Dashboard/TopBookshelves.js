import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export class TopBookshelves extends Component {
  
  render() {
    
    const responsive = {  
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
      }
    }
    
    return (
      <div>
        {
          this.props.shelves.length !== 0 && 
          <Carousel 
          swipeable={false}
          draggable={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          keyBoardControl={true}
          >
            {
              this.props.shelves.map((shelf) =>(
                <div key={shelf.shelf_title} className="container-fluid" style={{paddingTop:'10px', paddingBottom:'20px'}}>
                    <div className="row">
                    <Link to={"/book-shelves/" + shelf.shelf_title}>
                      <img className="img" alt={shelf.shelf_title} src={shelf.shelf_pic}  style={{width: '235px', height: '235px', border:'3.5px solid black'}} />
                    </Link>
                  </div>
                  <div className="row" style={{paddingTop:'10px'}}>
                      <h4 className="text-center w-100">
                        <Link to={"/book-shelves/" + shelf.shelf_title} className="text-dark text-decoration-none">
                          {shelf.shelf_title}
                        </Link>
                      </h4>
                  </div>

                </div>
              ))
            }
      
          </Carousel>
        }
      </div>
      
    )
  }
}

export default TopBookshelves