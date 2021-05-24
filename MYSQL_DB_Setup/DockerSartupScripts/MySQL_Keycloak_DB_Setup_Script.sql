-- If keycloak database exists leave it alone!!!!

-- IF NOT EXISTS ( SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'keycloak')
-- BEGIN
  CREATE DATABASE IF NOT EXISTS  keycloak character set latin1;

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

-- END