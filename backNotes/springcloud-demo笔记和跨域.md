> 代码地址：https://github.com/yin-git-hub/Knowledge-Fragments/tree/master/springcloud/any-test-back

### 跨域问题解决

1. 方法上添加@CrossOrigin

   ~~~java
   @PostMapping("/test1")
   @CrossOrigin
   public String test1(){
       String v = "wwwww";
       return v ;
   }
   ~~~

2. 创建gateway，在yml中配置

   ```properties
   spring.cloud.gateway.routes[0].id=water-sty
   spring.cloud.gateway.routes[0].uri=http://127.0.0.1:7331 
   spring.cloud.gateway.routes[0].predicates[0]=Path=/water-sty/**
   
   npm i pinia-plugin-persistedstate
   spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOriginPatterns=*
   spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedHeaders=*
   spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods=*
   spring.cloud.gateway.globalcors.cors-configurations.[/**].allowCredentials=true
   spring.cloud.gateway.globalcors.cors-configurations.[/**].maxAge=3600
   ```

3. 创建gateway，写配置类

   ~~~java
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import org.springframework.web.cors.CorsConfiguration;
   import org.springframework.web.cors.reactive.CorsWebFilter;
   import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
   
   @Configuration
   public class CorsConfig { 
       /**
        * 配置跨域资源共享
        * @return
        */
       @Bean
       public CorsWebFilter corsWebFilter(){ 
           //创建对象
           CorsConfiguration configuration=new CorsConfiguration();
           //允许跨域的网路地址
           configuration.addAllowedOrigin("*");
           //允许cookie携带
           configuration.setAllowCredentials(true);
           //允许的请求方式
           configuration.addAllowedMethod("*");
           //允许携带头信息
           configuration.addAllowedHeader("*");
   
           //创建配置对象
           UrlBasedCorsConfigurationSource configurationSource=new UrlBasedCorsConfigurationSource();
           //设置配置
           configurationSource.registerCorsConfiguration("/**",configuration);
           return new CorsWebFilter(configurationSource);
       } 
   }
   ~~~

### nacos配置中心的配置

1. 创建 nacos为名的数据库，导入sql脚本（sql在代码中）

2. docker 创建 nacos

   ~~~sh
   docker run -d  \
   -e MODE=standalone  \
   -e PREFER_HOST_MODE=hostname  \
   -e SPRING_DATASOURCE_PLATFORM=mysql  \
   -e MYSQL_SERVICE_HOST=192.168.100.130  \
   -e MYSQL_SERVICE_PORT=3307  \
   -e MYSQL_SERVICE_USER=root  \
   -e MYSQL_SERVICE_PASSWORD=123456 \
   -e MYSQL_SERVICE_DB_NAME=nacos  \
   -p 8848:8848  \
   --name nacos  \
   --restart=always  \
   nacos/nacos-server:1.4.1
   ~~~

3. 添加依赖

   ~~~xml
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
   </dependency>
   ~~~

4. 添加配置文件bootstrap.properties

   ~~~properties
   spring.application.name=service-one
   spring.profiles.active=dev
   spring.cloud.nacos.discovery.server-addr=192.168.100.130:8848
   spring.cloud.nacos.config.server-addr=192.168.100.130:8848
   spring.cloud.nacos.config.prefix=${spring.application.name}
   # nacos配置文件命名为
   # spring.application.name
   # +“-”
   # +spring.profiles.active
   # +“.”+spring.cloud.nacos.config.file-extension
   # 名为service-one-dev.yaml
   spring.cloud.nacos.config.file-extension=yaml
   # 通用配置
   # common.yaml为公共配置，后续有需要的service模块都可直接引用，避免重复配置
   # spring.cloud.nacos.config.shared-configs[0].data-id=common.yaml
   ~~~

5. 然后在nacos上面新建配置







   