import mongoose, { Document, Schema } from 'mongoose';

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
  startDate?: string;
  endDate?: string;
  responsibilities?: string;
}

interface IEducation {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

interface ISkills {
  technicalSkills?: string;
  softSkills?: string;
}

interface IProject {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface IAdditionalInformation {
  languages?: string;
  certifications?: string;
  awards?: string;
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
  skills: ISkills;
  projects: IProject[];
  additionalInformation: IAdditionalInformation;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the profile document
const ProfileSchema: Schema<IProfile> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
        startDate: { type: String },
        endDate: { type: String },
        responsibilities: { type: String },
      },
    ],
    educations: [
      {
        degree: { type: String },
        institution: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        location: { type: String },
      },
    ],
    skills: {
      technicalSkills: { type: String },
      softSkills: { type: String },
    },
    projects: [
      {
        name: { type: String },
        description: { type: String },
        startDate: { type: String },
        endDate: { type: String },
      },
    ],
    additionalInformation: {
      languages: { type: String },
      certifications: { type: String },
      awards: { type: String },
    },
  },
  { timestamps: true }
);

// Create and export the model
const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
