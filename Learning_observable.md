# Observable 을 구현하면서 Observable 구현하기

### Safe Observer : 
Observable은 단지 function일 뿐이다. sugscribe를 할때까지 어떤 기능도 하지 않는다. 

사용자의 observer를 구성하고 끝나며, call되기를 기다리는 이전 function으로 돌아간다. 

반면 observer는 동적이며 생성자로부터의 이벤트를 듣고 있다.

#### observer가 보장하는 것들

* 만약 Observer에 모든 메소드가 구현되어 있지 않은 채 전달되어도 괜찮다.
* unsubscribe 후에는 아무것도 call하지 않는다.
* complate나 error 후에 next를 호출하고 싶지는 않을 것이다.
* complate와 error를 call하는 것은 unsubscribe로직을 필요로 한다.
* next, complate나 error 핸들러가 예외를 던진다면, unsubscribe 로직을 호출함으로서 리소스 낭비를 줄일 수 있다.
* next, error, complate는 사실 옵셔널하다. 모든 밸류나 에러를 핸들링할 필요 없으며 한 가지나 두 가지만 핸들링해도 괜찮다.
<br><br>
위를 보장하기 위해 safeObserver로 익명의 observer를 감싼다.