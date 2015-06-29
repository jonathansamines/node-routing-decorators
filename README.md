## Hapi MVC routing
I come from [.NET world](http://www.dotnetfoundation.org/), all majorty of my web development experience comes from .NET development stacks, specifically in my case from [ASP MVC and Web API frameworks](https://github.com/aspnet). I didn´t like .NET environments (specially for Windows development env), but there area two things that i really love from .NET:

The first one is the [C# programming language](https://msdn.microsoft.com/en-us/library/z1zx9t92.aspx), which is (in my humble opinion) a really awesome, stable and powerful programming language, which has the best from Java, some really nice additional programming concepts like async, delegates, annotations, some dynamic stuff, lambdas, etc.

The second one is ASP MVC. I really love the programming model behind this web application framework. Recently Microsoft make some really cool changes, and one of those was the release of the next generation web framework: [asp vnext](http://www.asp.net/vnext), which comes with a lot of changes both in the framework itself as with the tooling and dependencies which comes with it. But the major important change (from the web framework perspective) was the unification of the programming model from their two web application frameworks; asp mvc and asp web api, which now has a shared routing framework.

For a more detailed introduction for this routing framework, take a look at the following links:

- [ASP.net Routing Framework](https://github.com/aspnet/Routing)
- [How asp Routing pipeline works](https://www.simple-talk.com/dotnet/.net-framework/an-introduction-to-asp.net-mvc-extensibility/)
- [How ASP MVC 6 (vnext) routing works](http://stephenwalther.com/archive/2015/02/07/asp-net-5-deep-dive-routing)
- [The new attribute routing](http://blogs.msdn.com/b/webdev/archive/2013/10/17/attribute-routing-in-asp-net-mvc-5.aspx#route-constraints)

This project aims to be a simple implementation for the ASP MVC routing framework, written as a wrapper around the incredible hapiJS web framework.

### Implementation scope
If your read some of the links above, now you have a general (like me) - because i´m not a asp developer expert- understanding of how this routing framework works. It hopefully would be enough for me and for anyone who likes to contribute.

The routing framework has to top level routing models:
 - Convention based routing
 - Attribute based routing
