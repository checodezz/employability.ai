import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interface for the profile
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface IWorkExperience {
  jobTitle?: string;
  company?: string;
  location?: string; // Add location to match data
  startDate?: string;
  endDate?: string;
  responsibilities?: string[]; // Changed to an array of strings
}

interface IEducation {
  degree?: string;
  institution?: string;
  graduationYear?: number; // Changed startDate/endDate to graduationYear for education
  location?: string;
}

interface ISkills {
  name: string;
  rating: number; // Match the skill structure with rating
}

interface IProject {
  name?: string;
  description?: string;
  technologies?: string[]; // Array of technologies for projects
  link?: string;
}

interface IAdditionalInformation {
  languages?: string;
  certifications?: string[]; // Changed to an array of strings
  awards?: string[]; // Changed to an array of strings
}

export interface IProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  personalInformation: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: IAddress;
  };
  professionalProfiles: {
    linkedinProfile?: string;
    portfolioWebsite?: string;
    githubProfile?: string;
  };
  workExperiences: IWorkExperience[];
  educations: IEducation[];
  skills: ISkills[]; // Array of skills, not just one object
  projects: IProject[];
  additionalInformation: IAdditionalInformation;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the profile document
const ProfileSchema: Schema<IProfile> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalInformation: {
      fullName: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      dateOfBirth: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
    },
    professionalProfiles: {
      linkedinProfile: { type: String },
      portfolioWebsite: { type: String },
      githubProfile: { type: String },
    },
    workExperiences: [
      {
        jobTitle: { type: String },
        company: { type: String },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        responsibilities: { type: [String] }, // Array of responsibilities
      },
    ],
    educations: [
      {
        degree: { type: String },
        institution: { type: String },
        graduationYear: { type: Number }, // Changed to graduationYear
        location: { type: String },
      },
    ],
    skills: [
      {
        name: { type: String },
        rating: { type: Number },
      },
    ],
    projects: [
      {
        name: { type: String },
        description: { type: String },
        technologies: { type: [String] }, // Array of technologies
        link: { type: String },
      },
    ],
    additionalInformation: {
      languages: { type: String },
      certifications: { type: [String] }, // Changed to array of strings
      awards: { type: [String] }, // Changed to array of strings
    },
  },
  { timestamps: true }
);

// Create and export the model
const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
