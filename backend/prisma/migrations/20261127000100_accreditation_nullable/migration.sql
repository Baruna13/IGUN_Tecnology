-- New schools have no accreditation yet.
ALTER TABLE "schools" ALTER COLUMN "accreditation" DROP NOT NULL;
