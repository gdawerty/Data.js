import alamin from "../assets/AAlamin.jpg";
import aaron from "../assets/AaronLuu.jpeg";
import li from "../assets/DLi.jpeg";
import wang from "../assets/Jwang.jpeg";

const About = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 mt-4">About</h1>
      <hr />
      <div style={{ marginTop: '50px' }}></div>

      
      {/* Add an image */}
      <div
        className="flex gap-4"
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
          textAlign: 'center',  // Ensures names are centered below images
        }}
      >
        {/* Jerry */}
        <div>
          <img
            src={wang}
            style={{
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <p>Jerry Wang</p>
        </div>
        
        {/* David */}
        <div>
          <img
            src={li}
            style={{
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <p>David Li</p>
        </div>
        
        {/* Aaron */}
        <div>
          <img
            src={aaron}
            style={{
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <p>Aaron Luu</p>
        </div>
        
        {/* Ahmed */}
        <div>
          <img
            src={alamin}
            style={{
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <p>Ahmed Alamin</p>
        </div>
      </div>
      <div style={{ marginTop: '30px' }}>

      <p>
        This is an AI-powered accounting management system for personal use. It helps you to manage your expenses,
        income, and savings, and provides AI-powered insights to help you save more money and reach your financial
        goals.
      </p>
      </div>
      <br />
      <p>
        {/* <strong>Authors:</strong>
        <ul>
          <li>Jerry Wang</li>
          <li>David Li</li>
          <li>Aaron Luu</li>
          <li>Ahmed Alamin</li>
        </ul> */}
      </p>
      <br />
      <strong>License (MIT): </strong>
      <p>
        Copyright 2025 Jerry Wang, Aaron Luu, David Li, and Ahmed Alamin.
        <br />
        <br />
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
        documentation files (the “Software”), to deal in the Software without restriction, including without limitation
        the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
        to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        <br />
        <br />
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of
        the Software.
        <br />
        <br />
        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
        THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
        CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  );
};

export default About;
