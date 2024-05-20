==Spring记忆遗漏笔记==

> 代码在 https://github.com/yin-git-hub/Knowledge-Fragments

### AOP切入点表达式

切入点表达式，就功能而言。就是为了选择哪些方法需要被增强的一个方法选择表达式。表达式有以下这些种类

![](./assets/57950482576d1062d2d1023d6b7d0057.png)

```java
// 所有方法
@Pointcut("execution(* *..*(..))")
// 指定参数，即入参本身的类型，不能放其接口、父类
@Pointcut("execution(* *..*(java.lang.String, java.lang.String)")
// 指定方法前缀
@Pointcut("execution(* *..*.prefix*(..))")
// 指定方法后缀
@Pointcut("execution(* *..*.*suffix(..))")
// 组合，增强所有方法，但是去掉指定前缀和指定后缀的方法
@Pointcut("execution(* *..*(..)) && (!execution(* *..prefix*(..)) || !execution(* *..*suffix(..)))")
```




| 表达式类型    | 功能                          |
| ------------- | ----------------------------- |
| execution()   | 匹配方法，最全的一个          |
| args()        | 匹配形参类型                  |
| @args()       | 匹配形参类型上的注解          |
| @annotation() | 匹配方法上的注解              |
| within()      | 匹配类路径                    |
| @within()     | 匹配类上的注解                |
| this()        | 匹配类路径，实际上AOP代理的类 |
| target()      | 匹配类路径，目标类            |
| @target()     | 匹配类上的注解                |



**获取执行的签名对象**

> ```
> ProceedingJoinPoint：专用于环绕通知
> 是JoinPoint子类，可以实现对原始方法的调用
> ```

```java
@Component
@Aspect
public class ProjectAdvice {
    //匹配业务层的所有方法
    @Pointcut("execution(* com.itheima.service.*Service.*(..))")
    private void servicePt(){}

    //设置环绕通知，在原始操作的运行前后记录执行时间
    @Around("ProjectAdvice.servicePt()")
    public void runSpeed(ProceedingJoinPoint pjp) throws Throwable {
        //获取执行的签名对象
        Signature signature = pjp.getSignature();
        String className = signature.getDeclaringTypeName();
        String methodName = signature.getName();
      	// 获取参数
        Object[] args = pjp.getArgs();

        long start = System.currentTimeMillis();
        try {
          // 执行原函数
          ret = pjp.proceed(args);
        } catch (Throwable t) {
            t.printStackTrace();
        }
        long end = System.currentTimeMillis();
        System.out.println("万次执行："+ className+"."+methodName+"---->" +(end-start) + "ms");
    }
  
  
  	@Before("pt()")
    public void after(JoinPoint jp) {
        Object[] args = jp.getArgs();
        System.out.println(Arrays.toString(args));
        System.out.println("after advice ...");
    }
}
```

**自定义注解**

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyTestAspect {
    String value1() default ""; // 第一个String类型属性
    String value2() default ""; // 第二个String类型属性
}

@Before("@annotation(myTestAspect)")
public void beforeMyTestAspect(MyTestAspect myTestAspect) {
    String value1 = myTestAspect.value1();
    String value2 = myTestAspect.value2(); 
}

```

