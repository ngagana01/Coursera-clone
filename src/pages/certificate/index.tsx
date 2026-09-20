import {
  Award,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Star,
} from "lucide-react";
import React from "react";

const index = () => {
  const certificates = [
    {
      id: 1,
      name: "Google Data Analytics Professional Certificate",
      provider: "Google",
      issueDate: "March 2024",
      expirationDate: "No Expiration",
      credentialID: "GDAPC-123456",
      skills: [
        "Data Analysis",
        "SQL",
        "R Programming",
        "Tableau",
        "Data Visualization",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      status: "completed",
      grade: 98,
      hours: 180,
    },
    {
      id: 2,
      name: "Meta Front-End Developer Professional Certificate",
      provider: "Meta",
      issueDate: "February 2024",
      expirationDate: "No Expiration",
      credentialID: "MFEPC-789012",
      skills: ["React", "JavaScript", "HTML", "CSS", "Web Development"],
      image:
        "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
      status: "completed",
      grade: 95,
      hours: 160,
    },
    {
      id: 3,
      name: "IBM Data Science Professional Certificate",
      provider: "IBM",
      issueDate: "In Progress",
      expirationDate: "-",
      credentialID: "-",
      skills: [
        "Python",
        "Machine Learning",
        "Data Science",
        "Statistical Analysis",
      ],
      image:
        "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80",
      status: "in-progress",
      progress: 75,
      hours: 120,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto ">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Certificates</h1>
              <p className="text-gray-600 mt-1">
                Track your learning achievements and credentials
              </p>
            </div>
            <button className="px-4 py-2 bg-[#0056D2] text-white rounded-md hover:bg-blue-700 transition-colors">
              Browse More Courses
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Total Certificate</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Lwarning Hours</p>
                <p className="text-2xl font-bold">460</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold">96.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-2xl font-bold">2/3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg shadow-sm everflow-hidden"
            >
              <div className="flex">
                <div className="w-64 h-48">
                  <img
                    src={cert.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{cert.name}</h2>
                      <p className="text-gray-600">{cert.provider}</p>
                    </div>
                    <div className="flex space-x-2">
                      {cert.status === "completed" ? (
                        <>
                          <button className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                          <button className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                            <ExternalLink className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-2 bg-[#0056D2] text-white rounded-md hover:bg-blue-700">
                          Continue Learning
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-medium">{cert.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Credentail ID</p>
                      <p className="font-medium">{cert.credentialID}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Learning Hours</p>
                      <p className="font-medium">{cert.hours} hours</p>
                    </div>
                  </div>
                  {cert.status === "in-progress" ? (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0056D2] h-2 rounded-full"
                          style={{ width: `${cert.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Final Grade</span>
                        <span>{cert.grade}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full ">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${cert.grade}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cert.skills.map((skill,index)=>(
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default index;
