import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import useHideMenu from '../../../hooks/useHideMenu';
import { resetCardUpdating, resetMySelection } from '../../../store/card/action';

const Play = () => {

    const { pathname } = useLocation();
    const path = pathname.replace('/', '');

    useHideMenu(false, path);

    const dispatch = useDispatch();

    useEffect(() => {
        
        dispatch(resetCardUpdating());
        dispatch(resetMySelection());

    }, [dispatch]);


    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id dictum diam. Cras id molestie ipsum. Mauris gravida, nunc id placerat aliquet, ante nisl porta felis, hendrerit feugiat odio erat interdum nulla. Integer placerat rhoncus ipsum, ac dignissim risus suscipit ut. Proin vehicula leo nec libero scelerisque aliquam. Maecenas porttitor gravida lectus, non consectetur eros hendrerit laoreet. Praesent quis massa laoreet, auctor justo et, accumsan felis. Nam condimentum pulvinar nunc, a posuere augue consequat vel. Cras maximus mattis lorem, at fermentum purus malesuada nec. Morbi eleifend elit sollicitudin, bibendum odio ut, condimentum lorem. Nam tempor tincidunt est eget dapibus. Proin pellentesque purus posuere sapien faucibus varius. Phasellus ut sollicitudin nulla. Praesent libero nibh, dignissim id pulvinar sed, pulvinar vel augue.

Nunc blandit dolor sapien. Donec feugiat ullamcorper imperdiet. Praesent ac hendrerit nisi, a congue ex. Proin ac maximus massa. Vivamus massa turpis, mattis et nibh vitae, finibus varius nisl. Pellentesque suscipit vestibulum nisl, et placerat ipsum scelerisque ut. Nulla tincidunt ac massa ut laoreet. Curabitur porttitor eros vitae consectetur maximus. Sed quis auctor purus. Nulla fringilla sed diam in ornare. Sed sodales ipsum in risus semper volutpat. Phasellus dictum commodo ex sed tristique.

Nunc mattis, eros eu imperdiet tincidunt, nisi felis porta leo, ac tincidunt diam orci nec tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam efficitur augue orci, sit amet tincidunt tellus commodo ac. Nam aliquam metus eu massa tempor, sit amet tristique orci semper. Praesent a lacinia mauris. Maecenas non suscipit urna. Pellentesque efficitur metus commodo risus convallis, nec cursus tellus vestibulum. Duis condimentum odio sapien, in aliquam nisi pharetra ut. Etiam augue libero, volutpat eget ligula id, suscipit imperdiet velit. In mollis eros ac lobortis dictum. Pellentesque eget purus semper, congue est in, auctor ligula. Vivamus eu orci quis erat pharetra placerat. Donec porta magna et facilisis malesuada. Pellentesque tortor est, dictum et ultricies vitae, pulvinar eget nisi.

Vivamus mi mi, posuere at aliquam id, posuere ac metus. Curabitur bibendum pharetra congue. Nunc ornare magna elit, ut pharetra erat dignissim volutpat. Mauris leo nulla, euismod nec leo eu, pretium vulputate massa. Donec vel erat et velit fermentum dignissim at a turpis. Nulla pellentesque metus vel ligula blandit, id iaculis tellus gravida. Etiam a mattis metus. Nunc posuere eros dapibus, auctor dolor a, feugiat felis. Cras semper tincidunt eros, quis vestibulum neque varius vitae. Morbi semper lectus eleifend sodales cursus.

Duis et ipsum sed eros consequat scelerisque volutpat maximus risus. Praesent sagittis ex sit amet fringilla viverra. Integer quis ex commodo nisi rutrum rutrum in at nisl. Duis vitae lectus sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam lectus tortor, tincidunt eu nunc nec, porttitor finibus ligula. Nulla viverra condimentum nibh, quis gravida dui ornare quis. Sed sed mattis ligula, quis pharetra nisi. Ut cursus ex vitae odio fermentum ultricies. Proin sit amet est blandit, pellentesque odio id, bibendum purus. Integer sit amet neque in lectus rutrum imperdiet. Morbi at venenatis lacus. Donec convallis nisl varius nunc rhoncus, sed volutpat risus fringilla. Nunc sagittis augue lorem, a pharetra odio venenatis et. Pellentesque ligula enim, tincidunt sed dignissim quis, sollicitudin eget magna.

Nullam facilisis purus vitae orci placerat rutrum. Pellentesque convallis, sem sed facilisis semper, ante lorem ultrices erat, quis condimentum lorem felis vitae lectus. Duis eu vulputate enim. Praesent ultrices aliquet purus, ut consectetur lectus tincidunt ut. Nulla nec felis vel nisl ornare malesuada. Maecenas ultrices elit vitae augue dictum finibus. Vestibulum at velit ultricies mi tempor congue. Pellentesque interdum nunc sed orci dictum feugiat.

Praesent faucibus mattis pretium. Aliquam auctor accumsan gravida. Sed vitae suscipit nibh. Donec arcu nisl, placerat non interdum in, finibus id erat. Quisque ac urna bibendum, lobortis lorem et, molestie libero. Mauris varius dui sem, id hendrerit augue eleifend vitae. Nulla hendrerit sed metus id malesuada. Donec eleifend tempus est eget sagittis. Vivamus facilisis facilisis blandit. Aenean fermentum nisl ac pretium blandit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc nec ante et nulla eleifend pellentesque quis ornare neque.

Nunc ut ultricies purus. Pellentesque tortor urna, mollis eget dui vitae, vehicula commodo velit. Morbi eu pretium erat. Quisque urna ante, vestibulum nec diam nec, pretium tempus sem. Aenean venenatis quis felis vitae vulputate. Phasellus sit amet quam placerat lorem mattis euismod sit amet nec ex. Donec egestas leo in condimentum tempor. Quisque sed tortor nec sem accumsan porttitor. Sed id est a velit porta aliquet. Duis malesuada arcu in fermentum vehicula. Nam pellentesque felis ac quam bibendum, vehicula sagittis ante ullamcorper. Maecenas nec sagittis neque.

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lobortis maximus sapien, eget pulvinar ipsum semper id. Fusce eget sagittis elit, et imperdiet velit. Nulla finibus egestas consequat. Donec ornare purus at facilisis mollis. Duis quis ipsum placerat, luctus ligula vitae, fermentum augue. Aenean ac fringilla felis. Nam elementum in turpis ac consequat.

Ut interdum velit a odio maximus rutrum. Nunc ultricies mi enim, ac ultricies dolor vestibulum et. In mollis erat arcu, in molestie orci tristique facilisis. Donec odio leo, cursus nec diam varius, cursus interdum mi. Nam lacinia tempus cursus. Praesent eget erat aliquet, ultrices nisi in, lacinia lectus. Donec egestas, metus interdum convallis varius, sem ligula sodales dolor, vehicula ullamcorper dui tortor malesuada turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In non nunc laoreet, ultrices ligula at, lacinia ipsum. Phasellus ullamcorper felis ullamcorper ipsum tempor dapibus. Quisque vehicula, nunc non imperdiet molestie, erat augue fringilla ligula, eget elementum eros eros convallis enim. Nam fermentum rutrum erat id ullamcorper. Integer augue metus, porttitor ultricies porta at, accumsan sit amet quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras dictum venenatis dictum.

Nullam eu pulvinar augue. Quisque arcu tellus, efficitur eu quam pharetra, varius tempus mauris. Donec semper, urna nec pretium volutpat, leo tortor ullamcorper nibh, porttitor lobortis mauris ex vitae mi. Suspendisse nec euismod arcu, in semper turpis. Sed dictum risus lorem, vitae eleifend libero fermentum tempor. Praesent consequat malesuada efficitur. Fusce turpis enim, interdum sit amet pellentesque maximus, consequat quis est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id ligula pulvinar, venenatis sapien gravida, pulvinar turpis. Vestibulum maximus turpis ut dolor condimentum, nec porttitor diam auctor. Nam quis ligula nec diam vehicula auctor at nec augue. Vestibulum magna urna, ullamcorper at augue vitae, placerat ullamcorper eros. Aliquam erat volutpat. Aenean fermentum, lorem nec vehicula pharetra, nisl turpis aliquam orci, at egestas massa lorem et sapien. Sed et erat eleifend, ultricies sem sed, egestas tortor. Donec ac metus accumsan, dapibus metus sed, porta sapien.

Nunc dictum fringilla feugiat. Cras consectetur varius libero, pharetra laoreet purus semper ut. Ut nibh augue, cursus mollis arcu ut, ultricies condimentum velit. Morbi condimentum mi sapien, eget bibendum neque ornare sed. Pellentesque nec purus tristique, scelerisque diam eget, laoreet tellus. Aliquam pharetra nulla elit, eleifend lobortis mauris euismod nec. In dolor urna, vulputate nec odio quis, vestibulum gravida purus. Phasellus vel ipsum diam. Integer id lorem a justo vulputate dapibus. Etiam enim neque, elementum a finibus vitae, aliquam et risus.

Nam id elit in arcu vestibulum pellentesque sed a est. Donec elementum convallis luctus. Quisque quis vestibulum nisl. Integer ac finibus eros. In a nibh urna. Fusce auctor dui ac lacus condimentum, non scelerisque augue gravida. Fusce turpis leo, semper nec est eget, vehicula maximus libero. Morbi maximus faucibus tristique. Curabitur porttitor pharetra lacus egestas maximus. Donec a est leo. Praesent rutrum enim in tincidunt varius. Ut tristique, magna ut sodales molestie, turpis turpis volutpat arcu, eget faucibus libero augue ac lacus.

Vestibulum sagittis nisi diam, a malesuada orci pulvinar id. Aliquam erat volutpat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras sit amet leo ornare, auctor nunc quis, sagittis purus. In vitae elit imperdiet, tincidunt ipsum id, eleifend erat. Praesent finibus id erat ac scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

Curabitur suscipit ligula eget dui vulputate rutrum. Nam in feugiat urna, sed convallis diam. Fusce eu elit et mauris imperdiet ultrices non eu felis. Donec fringilla erat neque, ac semper ex gravida eget. Nam id condimentum purus, varius dignissim neque. Cras ipsum lectus, ullamcorper sed vestibulum non, dictum nec lectus. Suspendisse ut laoreet enim. Curabitur a quam at ex vestibulum ornare. Ut nec tempus ex. Etiam urna ante, sollicitudin vitae rutrum nec, facilisis at elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed aliquet nunc a velit egestas, vitae suscipit mi mattis. Vestibulum blandit urna at augue posuere consectetur.

Aliquam erat volutpat. Vivamus tincidunt faucibus convallis. Nulla ut justo viverra, auctor dui in, cursus dolor. Praesent placerat ex enim. Pellentesque nec neque libero. Sed et pulvinar tellus, nec molestie augue. Donec dignissim ligula at nibh sodales, sit amet sagittis nisl ullamcorper. Donec condimentum, tellus a viverra consectetur, mi felis tristique diam, ut vestibulum urna nunc sit amet ipsum. Nunc non justo non dolor feugiat fringilla quis id ipsum. Nam tempus eget mi non pulvinar. Suspendisse ac tristique nunc. Ut egestas tortor eu ex vestibulum, ac scelerisque leo volutpat.

Donec ultricies vel ipsum ultrices varius. Donec a feugiat nunc. Suspendisse egestas mauris vel ligula suscipit, sed efficitur tellus tristique. Aenean laoreet vitae arcu quis sagittis. Etiam malesuada ligula eget augue eleifend, id facilisis mi finibus. Donec imperdiet pellentesque dapibus. Maecenas vel massa sit amet justo iaculis pulvinar vel non nisi. Pellentesque pretium ullamcorper enim, id feugiat nibh vulputate quis. Praesent maximus lacus ac enim pulvinar semper. Cras et lectus placerat, pulvinar enim eu, tincidunt nibh. Vestibulum ultricies dui at tortor pretium, ut sollicitudin lacus mattis.

Mauris sit amet scelerisque dui. Praesent congue metus placerat ipsum rhoncus finibus. Mauris ac tincidunt nisl. Praesent volutpat urna id placerat laoreet. In id vehicula velit. Pellentesque feugiat lorem ac risus vulputate consequat eu id urna. Nunc vitae lorem metus.

Vivamus sem lectus, dignissim a enim sit amet, interdum tempus turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis mollis, nibh at rutrum ultricies, neque magna rhoncus sapien, a tempor odio risus sit amet velit. Pellentesque mi justo, porta nec ante at, mattis euismod tellus. Maecenas eu felis massa. In tempor turpis quis ex sollicitudin, id pretium sapien dictum. Suspendisse varius, nisi sit amet ultrices dictum, est tellus facilisis tellus, quis dignissim velit metus at nulla.

Pellentesque aliquam id neque ut varius. Sed ullamcorper mauris in velit blandit, eget consectetur massa vestibulum. Aenean mattis consectetur lacus, at dapibus leo dignissim ut. Sed a ex lacus. Duis sodales tincidunt urna a rhoncus. Sed in dapibus sem, non eleifend orci. Vivamus dignissim lobortis velit, at ultricies tellus porta nec. Nullam cursus est quam, at pulvinar quam maximus non. Phasellus eget sem ac nulla fringilla eleifend non sit amet nisl. Proin id magna eleifend, convallis lorem a, congue dolor. Ut auctor, ex vitae condimentum tempus, orci lorem sollicitudin dolor, at tincidunt ex lacus vel ipsum.
        </div>
    )
}

export default Play
