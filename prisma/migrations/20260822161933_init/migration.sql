-- CreateTable
CREATE TABLE "users" (
    "userId" INTEGER NOT NULL,
    "username" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "weights" (
    "weightId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "memo" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "weights_pkey" PRIMARY KEY ("weightId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "weights_createdBy_idx" ON "weights"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "weights_createdBy_date_key" ON "weights"("createdBy", "date");

-- AddForeignKey
ALTER TABLE "weights" ADD CONSTRAINT "weights_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
