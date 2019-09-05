import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div >
                <div className="footer">
                    <div>
                        <h2>About</h2>
                        <ul className="foot">
                            <li>News</li>
                            <li>Ahmed bio</li>
                            <li>Advertise: Web</li>
                            <li>Contests</li>
                        </ul>
                    </div>
                    <div>
                        <h2>My Space</h2>
                        <ul className="foot">
                            <li>My menu planner</li>
                            <li>My grocery list</li>
                            <li>My profile</li>
                            <li>Gift cards</li>
                        </ul>
                    </div>
                    <div>
                        <h2>OUR COMPANY</h2>
                        <ul className="foot">
                            <li>Careers</li>
                            <li>Affiliates</li>
                            <li>Blog</li>
                            <li>Recipes</li>
                        </ul>
                    </div>
                    <div>
                        <h2>HELP CENTER</h2>
                        <ul className="foot">
                            <li>FAQs</li>
                            <li>Contact</li>
                            <li>Technical support</li>
                            <li>Terms of use</li>
                        </ul>
                    </div>
                </div>
                <div >
                    <ul className="footer_bottom foot">
                        <li>© 2019 Ahmed Inc. All rights reserved |</li>
                        <li>Sitemap |</li>
                        <li>Privacy Policy |</li>
                        <li>Terms and conditions</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Footer