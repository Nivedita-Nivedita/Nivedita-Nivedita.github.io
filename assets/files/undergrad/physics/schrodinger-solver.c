#include<stdio.h>
#include<math.h>
#include<complex.h>
int fermi(double k1,double k2,double rho){
    if(2*M_PI*rho>k1*k1+k2*k2)
        return 1;
    return 0;
}

double complex integrand(double k1,double k2,double q1,double q2,double omega,double eta,double rho){
    return (fermi(k1,k2,rho)-fermi(k1+q1,k2+q2,rho))/(omega+I*eta+(k1*k1+k2*k2-(k1+q1)*(k1+q1)-(k2+q2)*(k2+q2)));
}

double f(double x,double y){
    return x*x*y;
}

double complex chi0(double limit,int N,double q1,double q2,double omega,double eta,double rho){
    double h=2*limit/N;
    double complex s=0;
    int i=1,j;
    for(;i<N;i++)
        for(j=0;j<N;j++)
            s+=integrand(i*h-limit,j*h-limit,q1,q2,omega,eta,rho);
    s+=(integrand(-limit,-limit,q1,q2,omega,eta,rho)+integrand(N*h-limit,N*h-limit,q1,q2,omega,eta,rho))/2;
    return 4*s*h*h;
}

double complex intchi0(double limit,int N,double q1,double q2,double eta,double rho){
    double h=limit/N;
    double complex s=0;
    for(int i=1;i<N;i++)
        s+=chi0(limit,N,q1,q2,i*h,eta,rho);
    s+=(chi0(limit,N,q1,q2,0,eta,rho)+chi0(limit,N,q1,q2,limit,eta,rho))/2;
    return (-s/(2*M_PI)-1)*(2*M_PI/sqrt(q1*q1+q2*q2));
}

double complex W0(double limit, int N,double eta,double rho){
    double h=2*limit/N;
    double complex s=0;
    int i=1,j;
    for(;i<N;i++)
        for(j=0;j<N;j++)
            s+=intchi0(limit,N,i*h-limit,j*h-limit,eta,rho);
    s+=(intchi0(limit,N,-limit,-limit,eta,rho)+intchi0(limit,N,limit,limit,eta,rho))/2;
    return s*h*h;
}

int main(){
    printf("%f",W0(100,100,0.001,1));
    return 0;
}
