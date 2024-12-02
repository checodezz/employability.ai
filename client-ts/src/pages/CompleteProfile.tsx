// src/pages/CompleteProfile.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "@/store/slices/resumeSlice"; // Ensure createProfile is imported
import { AppDispatch } from "@/store/store";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import TextInput from "@/components/TextInput";
import WorkExperience from "@/components/WorkExperience";
import Education from "@/components/Education";
import ProjectSection from "@/components/ProjectSection";
import AwardsSection from "@/components/AwardSection";
import SkillsSection from "@/components/SkillsSection";

interface Skill {
  name: string;
  rating: number;
}

const CompleteProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Accessing user and resume data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const { uploading, error, parsedData } = useSelector(
    (state: RootState) => state.resume
  );

  // Personal Information
  const [fullName, setFullName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState<string>(user?.dob || "");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Other fields (professional profiles, work experiences, etc.)
  const [linkedinProfile, setLinkedinProfile] = useState<string>("");
  const [portfolioWebsite, setPortfolioWebsite] = useState<string>("");
  const [githubProfile, setGithubProfile] = useState<string>("");
  const [workExperiences, setWorkExperiences] = useState<Array<any>>([]);
  const [educations, setEducations] = useState<Array<any>>([]);
  const [projects, setProjects] = useState<Array<any>>([]);
  const [awards, setAwards] = useState<string[]>([]); // Initialize as an empty array
  const [skills, setSkills] = useState<Skill[]>([]); // Array of skills with ratings
  const [languages, setLanguages] = useState<string>("");
  const [certifications, setCertifications] = useState<string[]>([]); // Assuming certifications can also be dynamic

  // Prefill data on response
  useEffect(() => {
    if (parsedData) {
      setFullName(parsedData.name || fullName);
      setEmail(parsedData.contact?.email || email);
      setPhoneNumber(parsedData.contact?.phone || phoneNumber);
      setAddress({
        street: parsedData.contact?.address?.street || address.street,
        city: parsedData.contact?.address?.city || address.city,
        state: parsedData.contact?.address?.state || address.state,
        postalCode:
          parsedData.contact?.address?.postalCode || address.postalCode,
        country: parsedData.contact?.address?.country || address.country,
      });
      setLinkedinProfile(parsedData.contact?.linkedin || linkedinProfile);
      setWorkExperiences(parsedData.experience || workExperiences);
      setEducations(parsedData.education || educations);
      setProjects(parsedData.projects || projects);
      setAwards(parsedData.awards || []);
      setCertifications(parsedData.certifications || []);

      // Convert skills array of strings to array of Skill objects with default rating
      if (parsedData.skills && Array.isArray(parsedData.skills)) {
        setSkills(
          parsedData.skills.map((skill: string) => ({ name: skill, rating: 3 }))
        );
      }

      // Handle languages if they are dynamic
      if (parsedData.languages && Array.isArray(parsedData.languages)) {
        setLanguages(parsedData.languages.join(", "));
      }
    }
  }, [parsedData]);

  // Handle file change for resume upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Dispatch the uploadResume action
      dispatch(uploadResume({ file, userId: user?.id || "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare profile data for submission
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
      skills, // Array of skills with ratings
      projects,
      additionalInformation: {
        languages,
        certifications,
        awards,
      },
    };

    if (user?.id) {
      // dispatch(createProfile({ userId: user.id, profileData }));
    }
  };

  // Functions for handling dynamic sections (Work Experience, Education, etc.)
  const addWorkExperience = () => {
    setWorkExperiences([
      ...workExperiences,
      {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        location: "",
      },
    ]);
  };

  const updateWorkExperience = (
    index: number,
    field: string,
    value: string
  ) => {
    setWorkExperiences((prevExperiences) => {
      const updatedExperiences = [...prevExperiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return updatedExperiences;
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setEducations((prevEducations) => {
      const updatedEducations = [...prevEducations];
      updatedEducations[index] = {
        ...updatedEducations[index],
        [field]: value,
      };
      return updatedEducations;
    });
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperiences((prevExperiences) => {
      const updatedExperiences = [...prevExperiences];
      updatedExperiences.splice(index, 1);
      return updatedExperiences;
    });
  };

  const removeEducation = (index: number) => {
    setEducations((prevEducations) => {
      const updatedEducations = [...prevEducations];
      updatedEducations.splice(index, 1);
      return updatedEducations;
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 shadow-lg rounded bg-white">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <ResumeUpload
            uploading={uploading}
            error={error}
            onFileChange={handleFileChange}
          />

          {/* Personal Information */}
          <TextInput
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextInput
            label="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            type="date"
          />

          {/* Professional Profiles */}
          <TextInput
            label="LinkedIn Profile"
            value={linkedinProfile}
            onChange={(e) => setLinkedinProfile(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <TextInput
            label="Portfolio Website"
            value={portfolioWebsite}
            onChange={(e) => setPortfolioWebsite(e.target.value)}
            placeholder="https://yourportfolio.com"
          />
          <TextInput
            label="GitHub Profile"
            value={githubProfile}
            onChange={(e) => setGithubProfile(e.target.value)}
            placeholder="https://github.com/yourprofile"
          />

          {/* Skills with Ratings */}
          <SkillsSection skills={skills} setSkills={setSkills} />

          {/* Work Experience */}
          <WorkExperience
            workExperiences={workExperiences}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
            onAdd={addWorkExperience}
          />

          {/* Education */}
          <Education
            educations={educations}
            onUpdate={updateEducation}
            onRemove={removeEducation}
            onAdd={addEducation}
          />

          {/* Projects */}
          <ProjectSection projects={projects} setProjects={setProjects} />

          {/* Awards */}
          <AwardsSection awards={awards} setAwards={setAwards} />

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Additional Information
            </h3>
            <TextInput
              label="Languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g., English, Hindi"
            />
            <TextInput
              label="Certifications"
              value={certifications.join(", ")}
              onChange={(e) => setCertifications(e.target.value.split(", "))}
              placeholder="e.g., AWS Certified Solutions Architect, PMP"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" variant="default">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
