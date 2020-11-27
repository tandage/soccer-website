import React, {useState} from "react";
import {Carousel} from "react-bootstrap";

export  default  function MyCarousel(props) {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel  className="mb-5 mt-1" activeIndex={index} onSelect={handleSelect}>
            { props.objs.map((value) => {
                    console.log(value)
                    return (
                        <Carousel.Item   style={{height:"28rem"}} >
                            <img
                                className="d-block w-100"
                                src={value.urlToImage}

                            />
                            <Carousel.Caption className="text-dark">
                                <h3>{value.author}</h3>
                                <p>{value.title}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })
            }

        </Carousel>
    );
}