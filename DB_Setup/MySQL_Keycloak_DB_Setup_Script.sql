-- ===================================================================

DROP DATABASE IF EXISTS keycloak;
CREATE DATABASE IF NOT EXISTS  keycloak character set latin1;

-- ===================================================================

DROP USER IF EXISTS 'kuser'@'%';
CREATE USER IF NOT EXISTS 'kuser'@'%' IDENTIFIED BY 'Pa55w0rd';

GRANT Alter ON keycloak.* TO 'kuser'@'%';
GRANT Create ON keycloak.* TO 'kuser'@'%';
GRANT Create view ON keycloak.* TO 'kuser'@'%';
GRANT Delete ON keycloak.* TO 'kuser'@'%';
-- GRANT Delete history ON keycloak.* TO 'kuser'@'%';
GRANT Drop ON keycloak.* TO 'kuser'@'%';
GRANT Grant option ON keycloak.* TO 'kuser'@'%';
GRANT Index ON keycloak.* TO 'kuser'@'%';
GRANT Insert ON keycloak.* TO 'kuser'@'%';
GRANT References ON keycloak.* TO 'kuser'@'%';
GRANT Select ON keycloak.* TO 'kuser'@'%';
GRANT Show view ON keycloak.* TO 'kuser'@'%';
GRANT Trigger ON keycloak.* TO 'kuser'@'%';
GRANT Update ON keycloak.* TO 'kuser'@'%';
GRANT Alter routine ON keycloak.* TO 'kuser'@'%';
GRANT Create routine ON keycloak.* TO 'kuser'@'%';
GRANT Create temporary tables ON keycloak.* TO 'kuser'@'%';
GRANT Execute ON keycloak.* TO 'kuser'@'%';
GRANT Lock tables ON keycloak.* TO 'kuser'@'%';

-- ===================================================================
DROP USER IF EXISTS 'keycloak'@'%';
CREATE USER IF NOT EXISTS 'keycloak'@'%' IDENTIFIED BY 'password';

GRANT Alter ON keycloak.* TO 'keycloak'@'%';
GRANT Create ON keycloak.* TO 'keycloak'@'%';
GRANT Delete ON keycloak.* TO 'keycloak'@'%';
GRANT Insert ON keycloak.* TO 'keycloak'@'%';
GRANT Select ON keycloak.* TO 'keycloak'@'%';
GRANT Update ON keycloak.* TO 'keycloak'@'%';
GRANT Drop ON keycloak.* TO 'keycloak'@'%';
GRANT Index ON keycloak.* TO 'keycloak'@'%';
GRANT Trigger ON keycloak.* TO 'keycloak'@'%';
GRANT References ON keycloak.* TO 'keycloak'@'%';
GRANT Show view ON keycloak.* TO 'keycloak'@'%';
GRANT Create view ON keycloak.* TO 'keycloak'@'%';
GRANT Alter routine ON keycloak.* TO 'keycloak'@'%';
GRANT Create routine ON keycloak.* TO 'keycloak'@'%';
GRANT Create temporary tables ON keycloak.* TO 'keycloak'@'%';
GRANT Lock tables ON keycloak.* TO 'keycloak'@'%';
GRANT Execute ON keycloak.* TO 'keycloak'@'%';

-- ===================================================================
-- ===================================================================
DROP DATABASE IF EXISTS petstore;
CREATE DATABASE IF NOT EXISTS petstore character set latin1;

DROP USER IF EXISTS 'PetTester'@'%';
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
