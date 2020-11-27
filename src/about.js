function About() {
    return (
        <div>

            <p className="mb-1 font-weight-bolder font-italic ">Thanks for your help !</p>
            <div className="pt-4 my-md-5 pt-md-5 border-top">
                <div className="row">
                    <div className="col-12 col-md">
                        <em>Aluminium</em>
                        <small className="d-block mb-3 text-muted">CS385</small>
                    </div>
                    <div className="col-6 col-md">
                        <h5>team members</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">LIWEN TAN</a></li>
                            <li><a className="text-muted" href="#">LAN BAI</a></li>
                            <li><a className="text-muted" href="#">XINSHUO WANG </a></li>
                            <li><a className="text-muted" href="#">HAIKUO HAN</a></li>

                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>techniques</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">React.js</a></li>
                            <li><a className="text-muted" href="#">React-router-v3</a></li>
                            <li><a className="text-muted" href="#">Bootstrap</a></li>
                            <li><a className="text-muted" href="#">React-Bootstrap</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>guide teacher</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">Peter</a></li>

                        </ul>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default About;