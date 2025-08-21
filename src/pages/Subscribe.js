import { Button, Container } from "react-bootstrap";
import { useState } from "react";
import AnimationTitles from "../components/functions/AnimationTitles";

function Subscribe() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim() === '') {
      alert('Please enter your email address!');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address!');
      return;
    }

    alert(`Thank you for subscribing with email: ${email}`);
    // Here you would typically send the email to your backend
    setEmail(''); // Clear the input after successful subscription
  };

  return (
    <div className="subscribe">
      <Container>
        <AnimationTitles
          title={`Subscribe to get fresh news update about our properties`}
          className="title text-center mx-auto w-75"
        />
        <p className="gray-50 text-center mt-3 mb-5">
          Stay up to date with Renting-Platform or get involved in our community
        </p>
        <div className="d-flex justify-content-between align-items-center mx-auto p-1">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="bg-transparent border-0 text-white ps-1 w-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
          />
          <Button className="m-0" onClick={handleSubscribe}>Subscribe</Button>
        </div>
      </Container>
    </div>
  );
}

export default Subscribe;
