if [ `getconf LONG_BIT` -ne "32" ]; 
then
      installpack="apache2 php5 mysql-server php5-mysql php5-gd libssh2-php openssh-server python3 screen wget unzip mc phpmyadmin ia32-libs openjdk-7-jre sudo proftpd mysql-client mysql-workbench curl php5-curl"
else
     installpack="apache2 php5 mysql-server php5-mysql php5-gd libssh2-php openssh-server python3 screen wget unzip mc phpmyadmin openjdk-7-jre sudo proftpd mysql-client mysql-workbench curl php5-curl"
fi
dpkg --add-architecture i386
apt-get update
export DEBIAN_FRONTEND=noninteractive;apt-get --allow-unauthenticated -y -q install $installpack
wget http://moonpanel.ru/ups/moonplcp.zip

rm /var/www/index.html
unzip moonplcp.zip -d /home/
rm moonplcp.zip
chmod 700 /home/cp
chmod 700 /home/cp/gameservers.py
chmod 777 /var/www/avatar/
groupadd gameservers
ln -s /usr/share/phpmyadmin /var/www/phpmyadmin


		dlinapass=10
rootmysqlpass=`base64 -w $dlinapass /dev/urandom | head -n 1`
mysqladmin -uroot password $rootmysqlpass
echo "create database moon" | mysql -uroot -p$rootmysqlpass
mysql moon -uroot -p$rootmysqlpass < /var/www/moon.sql

a2enmod rewrite
sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/sites-enabled/000-default
sed -i 's/# DefaultRoot/DefaultRoot/g' /etc/proftpd/proftpd.conf
sudo sh -c "echo 'DenyGroups gameservers' >> /etc/ssh/sshd_config"
service apache2 restart
service proftpd restart
service ssh restart

for i in `seq 1 100`;
do
   echo 
done

echo " " | mysql -uroot -p$rootmysqlpass

ROOTMYSQL=$rootmysqlpass
IP=`ifconfig eth0 | grep "inet addr" | head -n 1 | cut -d : -f 2 | cut -d " " -f 1`
chmod -R 777 /var/www/*

info="Установка пройдена успешно!\n
--------------------------------------------------\n
Данные для входа в панель:\n
URL: http://$IP/\n
--------------------------------------------------\n
--------------------------------------------------\n
Данные от PHPmyadmin:\n
Адрес: http://$IP/phpmyadmin/\n
Пользователь: root\n
Пароль: $rootmysqlpass\n
База: moon\n
--------------------------------------------------\n
Спасибо за покупки панели MoonPanel v.3.0\n
Все эти данные успешно сохранены в разделе /var/www/ файл MoonPanel.txt\n
-------------------MOONPANEL.RU-----------\n"
echo $info
echo $info > /var/www/MoonPanel.txt