import Image from 'next/image';
import React from 'react';
import { IoLogoFacebook } from 'react-icons/io';
import { IoLogoInstagram } from 'react-icons/io';

const Footer = () => {
  return (
    <footer className="text-white bg-primary w-full h-auto">
      <div className=" py-5 wrappers">
        <Image src="/assets/frontend/logofooter.png" alt="logo" width={224} height={40} className="h-10 md:hidden" />
        <div className="flex  flex-wrap w-full gap-5 md:gap-20 pt-4  ">
          <Image
            src="/assets/frontend/logofooter.png"
            alt="logo"
            width={224}
            height={40}
            className="h-10 hidden md:block"
          />
          <div>
            <h2 className="font-bold pb-4">Company</h2>
            <ul className="flex flex-col gap-4">
              <li>About Us</li>
              <li>Programs</li>
              <li>Destination</li>
              <li>Impact Stories</li>
              <li>Partner`s Link</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold pb-4">Others</h2>
            <ul className="flex flex-col gap-4">
              <li>Terms and Conditions</li>
              <li>Booking Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold pb-4">Follow Us</h2>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-1">
                <IoLogoFacebook />
                Facebook
              </li>
              <li className="flex items-center gap-1">
                <IoLogoInstagram />
                Instagram
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center md:justify-end w-full pt-4">© 2025. All rights reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
