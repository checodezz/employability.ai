import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import { uploadResume } from "@/store/resumeSlice"; // Assuming you have this action
import { uploadResume } from "@/store/slices/resumeSlice";
import { AppDispatch } from "@/store/store";

const CompleteProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const { uploading, error, parsedData } = useSelector(
    (state: RootState) => state.resume
  );

  // Personal Information
  const [fullName, setFullName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Professional Profiles
  const [linkedinProfile, setLinkedinProfile] = useState<string>("");
  const [portfolioWebsite, setPortfolioWebsite] = useState<string>("");
  const [githubProfile, setGithubProfile] = useState<string>("");

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<Array<any>>([]);

  // Education
  const [educations, setEducations] = useState<Array<any>>([]);

  // Skills
  const [technicalSkills, setTechnicalSkills] = useState<string>("");
  const [softSkills, setSoftSkills] = useState<string>("");

  // Projects
  const [projects, setProjects] = useState<Array<any>>([]);

  // Additional Information
  const [languages, setLanguages] = useState<string>("");
  const [certifications, setCertifications] = useState<string>("");
  const [awards, setAwards] = useState<string>("");

  // Resume File
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Update form fields when parsedData changes
  useEffect(() => {
    if (parsedData) {
      setFullName(parsedData.fullName || fullName);
      setPhoneNumber(parsedData.phoneNumber || phoneNumber);
      setAddress({
        street: parsedData.address?.street || address.street,
        city: parsedData.address?.city || address.city,
        state: parsedData.address?.state || address.state,
        postalCode: parsedData.address?.postalCode || address.postalCode,
        country: parsedData.address?.country || address.country,
      });
      setLinkedinProfile(parsedData.linkedinProfile || linkedinProfile);
      setWorkExperiences(parsedData.workExperiences || workExperiences);
      setEducations(parsedData.educations || educations);
      setTechnicalSkills(parsedData.technicalSkills || technicalSkills);
      setProjects(parsedData.projects || projects);
    }
  }, [parsedData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Dispatch the uploadResume action
      dispatch(uploadResume({ file, userId: user?._id || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare profile data
    const profileData = {
      personalInformation: {
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
        address,
      },
      professionalProfiles: {
        linkedinProfile,
        portfolioWebsite,
        githubProfile,
      },
      workExperiences,
      educations,
      skills: {
        technicalSkills,
        softSkills,
      },
      projects,
      additionalInformation: {
        languages,
        certifications,
        awards,
      },
    };

    try {
      const response = await fetch("/api/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit profile");
      }

      // Handle successful submission
      console.log("Profile data submitted:", data);
      navigate("/next-step");
    } catch (error) {
      console.error("Error submitting profile data:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  // Functions to handle dynamic sections (Work Experience, Education, Projects)
  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  };

  const updateWorkExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index][field] = value;
    setWorkExperiences(updatedExperiences);
  };

  const removeWorkExperience = (index: number) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences.splice(index, 1);
    setWorkExperiences(updatedExperiences);
  };

  // Similar functions for Education and Projects can be created

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 shadow-lg rounded bg-white">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Your Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded p-2"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Personal Information */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-300 rounded p-2 bg-gray-100"
              />
            </div>
            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="+1XXXXXXXXXX"
                required
              />
            </div>
            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                className="w-full border border-gray-300 rounded p-2 mb-2"
                placeholder="Street Address"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-1/3 border border-gray-300 rounded p-2"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-1/3 border border-gray-300 rounded p-2"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  className="w-1/3 border border-gray-300 rounded p-2"
                  placeholder="Postal Code"
                />
              </div>
              <input
                type="text"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                className="w-full border border-gray-300 rounded p-2 mt-2"
                placeholder="Country"
              />
            </div>
          </section>

          {/* Professional Profiles */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Professional Profiles
            </h3>
            {/* LinkedIn Profile */}
            <div className="mb-4">
              <label className="block text-gray-700">LinkedIn Profile</label>
              <input
                type="url"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            {/* Portfolio Website */}
            <div className="mb-4">
              <label className="block text-gray-700">Portfolio Website</label>
              <input
                type="url"
                value={portfolioWebsite}
                onChange={(e) => setPortfolioWebsite(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="https://your-website.com"
              />
            </div>
            {/* GitHub Profile */}
            <div className="mb-4">
              <label className="block text-gray-700">GitHub Profile</label>
              <input
                type="url"
                value={githubProfile}
                onChange={(e) => setGithubProfile(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="https://github.com/your-profile"
              />
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
            {workExperiences.map((experience, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <div className="flex justify-between">
                  <h4 className="text-lg font-medium mb-2">
                    Experience {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeWorkExperience(index)}
                  >
                    Remove
                  </Button>
                </div>
                {/* Job Title */}
                <div className="mb-2">
                  <label className="block text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) =>
                      updateWorkExperience(index, "jobTitle", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                {/* Company Name */}
                <div className="mb-2">
                  <label className="block text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={experience.companyName}
                    onChange={(e) =>
                      updateWorkExperience(index, "companyName", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                {/* Other fields... */}
                {/* Start Date and End Date */}
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-gray-700">Start Date</label>
                    <input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "startDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">End Date</label>
                    <input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "endDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>
                </div>
                {/* Responsibilities */}
                <div className="mb-2">
                  <label className="block text-gray-700">
                    Responsibilities
                  </label>
                  <textarea
                    value={experience.responsibilities}
                    onChange={(e) =>
                      updateWorkExperience(
                        index,
                        "responsibilities",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded p-2"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addWorkExperience}>
              Add Work Experience
            </Button>
          </section>

          {/* Education */}
          {/* Similar implementation as Work Experience */}

          {/* Skills */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            {/* Technical Skills */}
            <div className="mb-4">
              <label className="block text-gray-700">Technical Skills</label>
              <textarea
                value={technicalSkills}
                onChange={(e) => setTechnicalSkills(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="List your technical skills separated by commas"
                rows={3}
              />
            </div>
            {/* Soft Skills */}
            <div className="mb-4">
              <label className="block text-gray-700">Soft Skills</label>
              <textarea
                value={softSkills}
                onChange={(e) => setSoftSkills(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="List your soft skills separated by commas"
                rows={3}
              />
            </div>
          </section>

          {/* Projects */}
          {/* Similar implementation as Work Experience */}

          {/* Additional Information */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Additional Information
            </h3>
            {/* Languages */}
            <div className="mb-4">
              <label className="block text-gray-700">Languages</label>
              <textarea
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="List the languages you know separated by commas"
                rows={2}
              />
            </div>
            {/* Certifications */}
            <div className="mb-4">
              <label className="block text-gray-700">Certifications</label>
              <textarea
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="List your certifications separated by commas"
                rows={2}
              />
            </div>
            {/* Awards */}
            <div className="mb-4">
              <label className="block text-gray-700">Awards and Honors</label>
              <textarea
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="List any awards or honors you've received"
                rows={2}
              />
            </div>
          </section>

          <Button type="submit" className="w-full" variant="default">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
