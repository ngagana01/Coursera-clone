import { BookOpen } from 'lucide-react'
import React from 'react'

const Fotter = () => {
  return (
    <footer className=" text-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center text-gray-600 mb-6">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <span className="ml-2 font-bold text-xl">Coursera</span>
              </div>
              <p className="text-gray-700">
                Learn without limits and access world-class education.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Coursera</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    What We Offer
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Leadership
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Catalog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Learners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Developers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Beta Testers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Translators
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">More</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Investors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-black">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2024 Coursera Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-black">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-black">
                Do Not Sell My Personal Information
              </a>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Fotter