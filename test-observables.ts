import { Observable } from "rxjs/Rx";

const UNACCEPTABLE_VALUE = 15;
const NUM_RETRIES_BEFORE_OK = 3;

let retries = 0;

/**
 * Un observable qui émet une séquence de nombres entre 1 et 10, chaque nombre
 * étant émis toutes les 250ms. Il est conçu pour générer une erreur quand il
 * doit émettre le nombre UNACCEPTABLE_VALUE tant que le nombre de ré-essais
 * est inférieur à NUM_RETRIES_BEFORE_OK. Quand on atteint ce nombre de ré-essais,
 * la séquence est émise en entier, sans erreur.
 */
var source = new Observable<number>(subscriber => {
    let i = 1;
    let emit = () => {
        if (retries < NUM_RETRIES_BEFORE_OK && i == UNACCEPTABLE_VALUE) {
            subscriber.error("5 is unacceptable");
            retries++;
        }
        else {
            subscriber.next(i);
            if (i == 10)
                subscriber.complete();
            else
                setTimeout(emit, 250);
            ++i;
        }
    };
    emit();
});

// essayer avec 2 retries, puis avec 3 retries
source.retry(3).finally(() => console.log('finally')).subscribe(
    val => {
        console.log(val);
    },
    err => {
        console.log(err);
    },
    () => console.log('done')
);

source.toPromise()
    .then(val => console.log('PROMISE: ' + val))
    .catch(err => console.log('PROMISE ERR: ' + err));