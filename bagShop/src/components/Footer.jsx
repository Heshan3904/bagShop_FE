import './footer.css'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col about">
          <h4>ABOUT</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="payments">
            <span className="payment">PayPal</span>
            <span className="payment">MC</span>
            <span className="payment">VISA</span>
            <span className="payment">AMEX</span>
          </div>
        </div>

        <div className="footer-col categories">
          <h4>CATEGORIES</h4>
          <ul>
            <li>Hand Bags</li>
            <li>Back packs</li>
            <li>Luggages</li>
            <li>Wallets</li>
          </ul>
        </div>

        <div className="footer-col info">
          <h4>INFORMATION</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Term & Condition</li>
            <li>Returns & Exchange</li>
            <li>Shipping & Delivery</li>
            <li>Private Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2026 All rights reserved | Design by OneZeroX</p>
      </div>
    </footer>
  )
}

export default Footer
