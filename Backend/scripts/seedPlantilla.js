import dotenv from "dotenv";
import mongoose from "mongoose";
import Branch from "../models/Branch.js";
import Employee from "../models/Employee.js";
import Plantilla from "../models/Plantilla.js";

dotenv.config();

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim().replace(/^['"]|['"]$/g, "");
};

const MONGO_URL =
  normalizeEnvValue(process.env.MONGO_URL) ||
  normalizeEnvValue(process.env.MONGODB_URI);

const branchSeeds = [
  {
    branchName: "Tagum City",
    region: "Region XI",
    provinceCity: "Davao del Norte",
    municipality: "Tagum City",
    specificLocation: "Main Branch",
    location: "Main Branch, Tagum City, Davao del Norte",
    description: "Primary operations branch",
  },
  {
    branchName: "Panabo City",
    region: "Region XI",
    provinceCity: "Davao del Norte",
    municipality: "Panabo City",
    specificLocation: "Panabo Branch",
    location: "Panabo Branch, Panabo City, Davao del Norte",
    description: "Panabo operations branch",
  },
  {
    branchName: "Pantukan",
    region: "Region XI",
    provinceCity: "Davao de Oro",
    municipality: "Pantukan",
    specificLocation: "Pantukan Branch",
    location: "Pantukan Branch, Pantukan, Davao de Oro",
    description: "Pantukan operations branch",
  },
];

const plantillaSeeds = {
  "Tagum City": [
    {
      role: "Branch Manager",
      department: "Operations",
      baseSalary: 45000,
      allowance: 5000,
      requiredCount: 1,
      description: "Leads branch operations and staff performance.",
    },
    {
      role: "HR Officer",
      department: "HR",
      baseSalary: 28000,
      allowance: 2500,
      requiredCount: 1,
      description: "Handles employee records, attendance, and HR coordination.",
    },
    {
      role: "Cashier",
      department: "Operations",
      baseSalary: 18500,
      allowance: 1200,
      requiredCount: 3,
      description: "Handles POS, cashiering, and customer transactions.",
    },
  ],
  "Panabo City": [
    {
      role: "Store Supervisor",
      department: "Operations",
      baseSalary: 26000,
      allowance: 2000,
      requiredCount: 1,
      description: "Supervises daily store operations.",
    },
    {
      role: "Cashier",
      department: "Operations",
      baseSalary: 18000,
      allowance: 1000,
      requiredCount: 2,
      description: "Handles POS and customer transactions.",
    },
    {
      role: "Dining Staff",
      department: "Service",
      baseSalary: 16500,
      allowance: 1000,
      requiredCount: 4,
      description: "Supports dining area service and customer needs.",
    },
  ],
  Pantukan: [
    {
      role: "Kitchen Lead",
      department: "Kitchen",
      baseSalary: 24000,
      allowance: 1800,
      requiredCount: 1,
      description: "Coordinates kitchen preparation and food quality.",
    },
    {
      role: "Dining Staff",
      department: "Service",
      baseSalary: 16500,
      allowance: 1000,
      requiredCount: 3,
      description: "Supports dining area service and customer needs.",
    },
    {
      role: "Cashier",
      department: "Operations",
      baseSalary: 17500,
      allowance: 1000,
      requiredCount: 2,
      description: "Handles cashiering and transaction accuracy.",
    },
  ],
};

const seedPlantilla = async () => {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL or MONGODB_URI is required to seed plantilla data");
  }

  await mongoose.connect(MONGO_URL);

  const existingIndexes = await Plantilla.collection.indexes();
  const obsoleteIndexes = existingIndexes.filter((index) => {
    const indexedFields = Object.keys(index.key || {});
    const isSingleRoleIndex = indexedFields.length === 1 && indexedFields[0] === "role";

    return (
      indexedFields.includes("name") ||
      indexedFields.includes("positionId") ||
      isSingleRoleIndex
    );
  });

  for (const index of obsoleteIndexes) {
    await Plantilla.collection.dropIndex(index.name);
    console.log(`Dropped obsolete Plantilla index: ${index.name}`);
  }

  for (const branchSeed of branchSeeds) {
    const branch = await Branch.findOneAndUpdate(
      { branchName: branchSeed.branchName },
      branchSeed,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const roles = plantillaSeeds[branch.branchName] || [];

    for (const plantillaSeed of roles) {
      await Plantilla.findOneAndUpdate(
        {
          branchId: branch._id,
          role: plantillaSeed.role,
        },
        {
          ...plantillaSeed,
          branchId: branch._id,
          status: "active",
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  const plantillas = await Plantilla.find();

  for (const plantilla of plantillas) {
    plantilla.filledCount = await Employee.countDocuments({
      assignedBranchId: plantilla.branchId,
      role: plantilla.role,
      status: "active",
    });
    await plantilla.save();
  }

  const count = await Plantilla.countDocuments();
  console.log(`Plantilla seed complete. Total plantilla records: ${count}`);
};

seedPlantilla()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
