import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "@/store/slices/resumeSlice"; // Assuming you have this action
import { AppDispatch } from "@/store/store";
import ResumeUpload from "@/components/ResumeUpload";
import TextInput from "@/components/TextInput";
import WorkExperience from "@/components/WorkExperience";
import Education from "@/components/Education";

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
  const [technicalSkills, setTechnicalSkills] = useState<string>("");
  const [softSkills, setSoftSkills] = useState<string>("");
  const [projects, setProjects] = useState<Array<any>>([]);
  const [languages, setLanguages] = useState<string>("");
  const [certifications, setCertifications] = useState<string>("");
  const [awards, setAwards] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string>(""); // Single field for both technical and soft skills

  // Update form fields when parsedData changes
  useEffect(() => {
    if (parsedData) {
      // Use parsed data to pre-fill form fields
      setFullName(parsedData.name || fullName);
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
      setTechnicalSkills(parsedData.skills?.join(", ") || technicalSkills); // Assuming skills are in an array
      setProjects(parsedData.projects || projects);

      if (parsedData.contact?.email) {
        setEmail(parsedData.contact.email); // Dynamically set email from parsed data
      }
    }
  }, [parsedData]);

  useEffect(() => {
    if (parsedData && parsedData.skills) {
      // Join array of skills into a comma-separated string
      setSkills(parsedData.skills.join(", "));
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (user?.id) {
      dispatch(createProfile({ userId: user.id, profileData }));
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
          <TextInput
            label="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <WorkExperience
            workExperiences={workExperiences}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
            onAdd={addWorkExperience}
          />
          <Education
            educations={educations}
            onUpdate={updateEducation}
            onRemove={removeEducation}
            onAdd={addEducation}
          />
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
