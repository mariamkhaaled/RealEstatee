INSERT INTO features (feature_name) VALUES
('Swimming Pool'),
('Smart Home'),
('Garage'),
('Central AC'),
('Security Cameras'),
('Ocean View'),
('Balcony'),
('Garden'),
('Elevator'),
('Furnished');

ALTER TABLE features
ADD CONSTRAINT unique_feature_name UNIQUE (feature_name);