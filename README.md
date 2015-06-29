## Hapi MVC routing
I come from [.NET world](http://www.dotnetfoundation.org/), all majorty of my web development experience comes from .NET development stacks, specifically in my case from [ASP MVC and Web API frameworks](https://github.com/aspnet). I didn´t like .NET environments (specially for Windows development env), but there area two things that i really love from .NET:

The first one is the [C# programming language](https://msdn.microsoft.com/en-us/library/z1zx9t92.aspx), which is (in my humble opinion) really awesome, stable and powerful programming language, which has the best from Java, some really nice additional programming concepts like async, delegates, annotations, some dynamic stuff, lambdas, etc.

The second one is ASP MVC. I really love the programming model behind this web application framework. Recently Microsoft has made some really cool changes, and one of those was the release of the next generation web framework: [asp vnext](http://www.asp.net/vnext), which comes with a lot of changes both in the framework itself as with the tooling and dependencies which comes with it. But the major important change (from the web framework perspective) was the unification of the programming model from their two web application frameworks; asp mvc and asp web api, which now has a shared routing framework.

For a more detailed introduction for this routing framework, take a look at the following links:

- [ASP.net Routing Framework](https://github.com/aspnet/Routing)
- [How asp Routing pipeline works](https://www.simple-talk.com/dotnet/.net-framework/an-introduction-to-asp.net-mvc-extensibility/)
- [How ASP MVC 6 (vnext) routing works](http://stephenwalther.com/archive/2015/02/07/asp-net-5-deep-dive-routing)
- [The new attribute routing](http://blogs.msdn.com/b/webdev/archive/2013/10/17/attribute-routing-in-asp-net-mvc-5.aspx#route-constraints)

This project aims to be a simple implementation for the ASP MVC routing framework, written as a wrapper around the incredible [hapiJS web framework](http://hapijs.com).

### Implementation scope
If you read some of the links above, now you have a general (like me) - because i´m not an asp developer expert- understanding of how this routing framework works. It hopefully would be enough for me and for anyone who likes to contribute.

The routing framework has to top level routing models:

 - **Convention based routing**
 - **Attribute based routing**

Both are really helpful approaches, but from my perspective the Convention based routing lost some of his utilities, because the introduction of the Attribute based routing.

Because of this, i would only implement the Attribute based routing, which i consider most useful, but also would implement a simple "global" conventions which would allow us to define a "template" pattern for all controllers; this would only allow constant values, a well two wildcards {controller} and {action}, which will match with the current controller and action (the same way of work of convention based routing), the main difference besides described above is that it only will allow one global template for the whole application. We can also specify default values for both wildcards.

This will allow us to define something like:

     /prefix-{controller=default}-postfix/prefix-{action=default}-postfix

Which is going to match as a global "default" convention for Controller/action pair. From my perspective this has a more sense than defining routes per controller at a global level.

Another routes customizations would be allowed as Attribute based routing, which are implemented as Data Attributes on c#. This would seem a limitation on port to javascript, but hopefully this would be implemented in the next lang spec ES7, which includes the concept of Decorator as described [here](https://github.com/wycats/javascript-decorators), which fortunately we can use right now with the help of experimental implementation of [babel](http://balbejs.io).

The attribute based routing, will allow you override the default naming conventions, enabling you using a more complex routing matching, as defined in the original asp mvc routing framework, you will allowed to use:

 - **[controller]** and **[action]** wildcards.
 - Action attributes pattern matching.
 - Default parameters for attributes.
 - Attribute constraints
 - General pattern matching via Regular Expressions.


### Attribute based routing
As mentioned above, i´m going to describe in detail the implementation details of each of this features.

#### Controller and Action wildcards
In a Controller class definition or in a class method definition (constructor functions and function as methods in javascript lang) are the only places in which a routing decorator can be placed.

At class definition level, we can refer to the current controller by using the {controller} wildcard, which would be replaced with the controller name (stripping out the "Controller" postfix/prefix if present).

```javascript
// maps to /home
@route('/[controller]')
class HomeController{}
```

We also can use default values to specify an action default (which also overrides the naming convention defaults).

```javascript
// the route /home maps to /home/index
@route('/[controller]/[action=index]')
class HomeController{
  index() {}
}
```

In case of an action, we can use [controller] and [action] in a similar way.

```javascript
@route('[controller]')
class HomeController{

  // this route maps to
  // /api/my-home/index
  @route('/api/my-[controller]/[action]')
  index() {}
}
```

The above will override the Controller generated prefix with the specified at action level.

#### Action attributes pattern matching
This is really an awesome feature, which allows you define path segments and match with the action arguments.


```javascript
@route('[controller]')
class HomeController{

  // the values on
  // /home/index/user/data would match to param and matching parameters
  @route('/{param}/{matching}')
  index(param, matching){}
}
```

#### Action attributes defaults
This feature allows you specify default values in case those were not specified on uri

```javascript
@route('[controller]')
class HomeController{

  // in case /home/jonathan is present, then the value of user var is "jonathan", in other case is set to "anonymous"
  @route('/{user=anonymous}')
  index(user) {}
}
```

#### Action attributes constraints
Action attributes are awsome but also too generic. Attribute constrains allow you define restrictions to an action attribute value, both with pre-defined constraints as with Regular Expressions.

```javascript
@route('[controller]')
class HomeController{

  // user attribute has to be an integer
  @route('/{user:int}')
  index(user) {}
}
```
