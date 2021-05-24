-- If petstore database exists leave it alone!!!!

-- IF ( NOT EXISTS ( SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'petstore'))
-- BEGIN

CREATE DATABASE IF NOT EXISTS petstore character set latin1;

-- ===================================================================

CREATE USER IF NOT EXISTS 'PetTester'@'%' IDENTIFIED BY 'Pa55word';

GRANT Alter ON petstore.* TO 'PetTester'@'%';
GRANT Create ON petstore.* TO 'PetTester'@'%';
GRANT Delete ON petstore.* TO 'PetTester'@'%';
GRANT Insert ON petstore.* TO 'PetTester'@'%';
GRANT Select ON petstore.* TO 'PetTester'@'%';
GRANT Update ON petstore.* TO 'PetTester'@'%';
GRANT Drop ON petstore.* TO 'PetTester'@'%';
GRANT Index ON petstore.* TO 'PetTester'@'%';
GRANT Trigger ON petstore.* TO 'PetTester'@'%';
GRANT References ON petstore.* TO 'PetTester'@'%';
GRANT Show view ON petstore.* TO 'PetTester'@'%';
GRANT Create view ON petstore.* TO 'PetTester'@'%';
GRANT Alter routine ON petstore.* TO 'PetTester'@'%';
GRANT Create routine ON petstore.* TO 'PetTester'@'%';
GRANT Create temporary tables ON petstore.* TO 'PetTester'@'%';
GRANT Lock tables ON petstore.* TO 'PetTester'@'%';
GRANT Execute ON petstore.* TO 'PetTester'@'%';
-- ===================================================================

-- END