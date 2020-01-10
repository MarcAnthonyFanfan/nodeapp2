package 'mysql-server' do
	action :install
end

package 'nodejs' do
	action :install
end

package 'npm' do
	action :install
end

package 'git' do
	action :install
end

branch_name = 'master'
git '/home/vagrant/nodeapp1' do                            
	repository 'https://github.com/MarcAnthonyFanfan/nodeapp1.git'
	action :sync
end

execute 'npm install' do
	cwd '/home/vagrant/nodeapp1'
	command 'npm install'
end

execute 'run db_setup.sql' do
	cwd '/home/vagrant/nodeapp1'
	command 'sudo mysql < db_setup.sql'
end

execute 'set timezone' do
	cwd '/home/vagrant/nodeapp1'
	command 'sudo unlink /etc/localtime; sudo ln -s /usr/share/zoneinfo/America/New_York /etc/localtime'
end

execute 'start node server' do
	cwd '/home/vagrant/nodeapp1'
	command 'pkill node; node app.js > /home/vagrant/node.log 2>&1 &'
end