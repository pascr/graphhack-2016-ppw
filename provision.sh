
echo
echo "Installing Java..."
sudo apt-get install openjdk-8-jre-headless


echo
echo "Installing Neo4j..."
cd /etc
wget -nv http://dist.neo4j.org/neo4j-community-3.0.0-RC1-unix.tar.gz
tar -xf neo4j-community-3.0.0-RC1-unix.tar.gz
rm neo4j-community-3.0.0-RC1-unix.tar.gz
export  NEO4J_HOME=/home/vagrant/neo4j-community-3.0.0-RC1
sed -i 's/#dbms\.connector\.http\.address=0\.0\.0\.\0:7474/dbms.connector.http.address=0.0.0.0:7474/' $NEO4J_HOME/conf/neo4j.conf

echo
echo "Updating Neo4j Config..."
echo
echo "Starting Neo4j..."
$NEO4J_HOME/bin/neo4j start
