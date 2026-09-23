from scipy.linalg import eigvalsh_tridiagonal, eigvalsh
import numpy as np
import matplotlib.pyplot as plt
hbar=1.0
m=1.0
w=1.0
L=100.0

def qr(A):
    m, n = A.shape
    Q = np.eye(m)
    for i in range(n - (m == n)):
        H = np.eye(m)
        H[i:, i:] = make_householder(A[i:, i])
        Q = np.dot(Q, H)
        A = np.dot(H, A)
    return Q, A
 
def make_householder(a):
    v = a / (a[0] + np.copysign(np.linalg.norm(a), a[0]))
    v[0] = 1
    H = np.eye(a.shape[0])
    H -= (2 / np.dot(v, v))*np.dot(v[:, None], v[None, :])
    return H


def eigen(A,tol):
	err=100;
	U=np.eye(A.shape[0])
	while err>=tol:
		q,r=qr(A);
		U=np.dot(U,q)
		H=np.dot(r,q)
		err=abs((A-H).max())
		A=H
	return A.diagonal(),U

def V(x):
    a=1
    #return a*abs(x-L/2);
    return m*w*w*(x-L/2)**2/2
    r#0eturn -a/abs(x-L/2)

n=100
L=10.0
h=L/(n-1);
A=np.zeros((n,n))
for i in range(0,n-1):
    A[i][i]=hbar*hbar/(m*h**2)+V(i*h)
    A[i][i+1]=A[i+1][i]=-hbar/(2*m*h*h)
A[n-1][n-1]=hbar*hbar/(m*h**2)

eig,U=eigen(A,0.001)

eig=np.sort(eig)
N=25
Eig=np.zeros(N);
for i in range(0,N):
	Eig[i]=eig[i]

v=np.zeros(n);
for i in range(0,n):
	v[i]=U[i][0]	

print(Eig)
plt.plot(v)
plt.ylabel('some numbers')
plt.show()